import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Modal, TextInput } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { DbContext } from '@/contexts/DbContext';
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Changed import
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { SignOutButton } from '@/components/SignOutButton';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
    const auth = useContext(AuthContext)
    const db = useContext(DbContext)
    const router = useRouter()
    const navigation = useNavigation()

    const [data, setData] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [expenses, setExpenses] = useState('')
    const [amount, setAmount] = useState('')

    // showing the header via setOptions()
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerRight: () => <SignOutButton />
        })
    }, [navigation])

    useEffect(() => {
        if (loaded == false) {
            fetchData()
            setLoaded(true)
        }
    }, [data, auth])

    useEffect( () => {
        setExpenses('')
        setAmount('')
    }, [modalVisible])


    const addData = async () => {
        const data = {
            time: new Date().getTime(),
            amount: parseInt(amount),
            expenses: expenses
        }
        const authUser = auth.currentUser.uid
        const path = `users/${authUser}/expenses`
        const docRef = await addDoc(collection(db, path), data)
    }

    const fetchData = async () => {
        const path = `users/${auth.currentUser.uid}/expenses`
        const q = query(collection(db, path))
        const unsub = onSnapshot(q, (querySnapshot) => {
            let items: any = []
            querySnapshot.forEach((doc) => {
                let item = doc.data()
                item.id = doc.id
                items.push(item)
            })
            setData(items)
        })

    }

    const ListItem = (props: any) => {
        return (
            <View style={styles.listItem}>
                <Text>{props.expenses}</Text>
                <Link href={{ pathname: "/detail", params: { id: props.id } }}>
                    <Text>Detail</Text>
                </Link>
            </View>
        )
    }

    const Separator = () => {
        return (
            <View style={styles.separator}></View>
        )
    }

    const renderItem = ({ item }: any) => {
        return (
            <ListItem expenses={item.expenses} id={item.id} />
        )
    }

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.addButton}
                //onPress={() => addData()} 
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>
                    <Ionicons name="add" size={24} />
                </Text>
            </Pressable>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id}
                ItemSeparatorComponent={Separator}
                style={styles.list}
            />
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
            >
                <View style={styles.modal}>
                    <View style={styles.modalContainer}>
                        <Text>Enter Expenses</Text>
                        <TextInput style={styles.modalInput} value={expenses} onChangeText={(val) => setExpenses(val)} />
                        <Text>Enter Amount</Text>
                        <TextInput style={styles.modalInput} inputMode="numeric" value={amount} onChangeText={(val) => setAmount(val)} />
                        <Pressable
                            style={styles.addItemButton}
                            onPress={() => {
                                addData()
                                setModalVisible(false)
                            }
                            }>
                            <Text style={styles.addItemText}>Add Expenses</Text>
                        </Pressable>
                    </View>
                    <Pressable style={styles.modalClose} onPress={() => setModalVisible(false)}>
                        <Text>Close</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    )
}

const AccountScreen = () => {
    const auth = useContext(AuthContext)
    const db = useContext(DbContext)
    const router = useRouter()
    const navigation = useNavigation()

    const [data, setData] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [income, setIncome] = useState('')
    const [amount, setAmount] = useState('')

    // showing the header via setOptions()
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerRight: () => <SignOutButton />
        })
    }, [navigation])

    useEffect(() => {
        if (loaded == false) {
            fetchData()
            setLoaded(true)
        }
    }, [data, auth])

    useEffect( () => {
        setIncome('')
        setAmount('')
    }, [modalVisible])


    const addData = async () => {
        const data = {
            time: new Date().getTime(),
            amount: parseInt(amount),
            income: income
        }
        const authUser = auth.currentUser.uid
        const path = `users/${authUser}/income`
        const docRef = await addDoc(collection(db, path), data)
    }

    const fetchData = async () => {
        const path = `users/${auth.currentUser.uid}/income`
        const q = query(collection(db, path))
        const unsub = onSnapshot(q, (querySnapshot) => {
            let items: any = []
            querySnapshot.forEach((doc) => {
                let item = doc.data()
                item.id = doc.id
                items.push(item)
            })
            setData(items)
        })

    }

    const ListItem = (props: any) => {
        return (
            <View style={styles.listItem}>
                <Text>{props.income}</Text>
                <Link href={{ pathname: "/incomedetails", params: { id: props.id } }}>
                    <Text>Detail</Text>
                </Link>
            </View>
        )
    }

    const Separator = () => {
        return (
            <View style={styles.separator}></View>
        )
    }

    const renderItem = ({ item }: any) => {
        return (
            <ListItem income={item.income} id={item.id} />
        )
    }

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.addButton}
                //onPress={() => addData()} 
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>
                    <Ionicons name="add" size={24} />
                </Text>
            </Pressable>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id}
                ItemSeparatorComponent={Separator}
                style={styles.list}
            />
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
            >
                <View style={styles.modal}>
                    <View style={styles.modalContainer}>
                        <Text>Enter Income</Text>
                        <TextInput style={styles.modalInput} value={income} onChangeText={(val) => setIncome(val)} />
                        <Text>Enter Amount</Text>
                        <TextInput style={styles.modalInput} inputMode="numeric" value={amount} onChangeText={(val) => setAmount(val)} />
                        <Pressable
                            style={styles.addItemButton}
                            onPress={() => {
                                addData()
                                setModalVisible(false)
                            }
                            }>
                            <Text style={styles.addItemText}>Add Income</Text>
                        </Pressable>
                    </View>
                    <Pressable style={styles.modalClose} onPress={() => setModalVisible(false)}>
                        <Text>Close</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    )
};

const SettingScreen = () => {
    const auth = useContext(AuthContext)
    const db = useContext(DbContext)
    const router = useRouter()
    const navigation = useNavigation()

    const [data, setData] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [expenses, setExpenses] = useState('')
    const [amount, setAmount] = useState('')

    // showing the header via setOptions()
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerRight: () => <SignOutButton />
        })
    }, [navigation])

    return (
        <View style={styles.centeredView}>
            <Text>Settings!</Text>
        </View>
    );
};

export default function App() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Account') {
                        iconName = 'plus-circle';
                    } else if (route.name === 'Settings') {
                        iconName = 'cog';
                    }

                    return <FontAwesome5 name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
            <Tab.Screen name="Settings" component={SettingScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addButton: {
        backgroundColor: "#333333",
        padding: 8,
        alignSelf: "center",
        width: 40,
        height: 40,
        borderRadius: 5,
        position: "absolute",
        right: 20,
        bottom: 20,
        zIndex: 999,
        justifyContent: "center",
        alignItems: "center"
    },
    addButtonText: {
        color: "#eeeeee",
        textAlign: "center",
        fontSize: 30,
    },
    listItem: {
        backgroundColor: "#CCCCCC",
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    separator: {
        backgroundColor: "#EEEEEE",
        height: 3,
    },
    list: {
        flex: 1,
    },
    modal: {
        padding: 20,
        flex: 1,
    },
    modalClose: {
        position: "absolute",
        right: 20,
        top: 20,
    },
    modalContainer: {
        flex: 1,
        marginVertical: 50
    },
    addItemButton: {
        backgroundColor: "#333333",
        padding: 8,
        alignSelf: "center",
    },
    addItemText: {
        color: "#CCCCCC",
        textAlign: "center",
    },
    modalInput: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#CCCCCC",
        padding: 8,
        marginBottom: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
