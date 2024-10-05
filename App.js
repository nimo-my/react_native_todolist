import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Fontisto from "@expo/vector-icons/Fontisto.js";
import { theme } from "./colors";

import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	ScrollView,
	Alert,
	Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDoKey";
const WORKING_KEY = "@workingKey";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
	const [working, setWorking] = useState(true);
	const [text, setText] = useState("");
	const [toDos, setToDos] = useState({}); // using hashmap instead of array
	const [workingScreen, setMainScreen] = useState(true);

	useEffect(() => {
		getData();
	}, []);

	const travel = () => {
		setWorking(false);
		setMainScreen(false);
	};
	const work = () => {
		setWorking(true);
		setMainScreen(true);
	};

	const onChangeText = (payload) => setText(payload);
	const addTodo = async () => {
		if (text === "") return;
		else {
			// save to do
			const newToDos = { ...toDos, [Date.now()]: { text, working } };
			console.log(newToDos);
			setToDos(newToDos);
			await storeData(newToDos);
			setText("");
		}
	};

	// storing object value
	const storeData = async (value) => {
		try {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
		} catch (e) {
			// saving error
		}
	};

	// reading object value
	const getData = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
			setToDos(JSON.parse(jsonValue));
		} catch (e) {
			// error reading value
		}
	};

	const deleteTodo = (key) => {
		Alert.alert("Delete TODO", "Do you really want to delete?", [
			{
				text: "Cancel",
			},
			{
				text: "Delete",
				style: "destructive",
				onPress: () => {
					const newToDos = { ...toDos };
					delete newToDos[key];
					setToDos(newToDos);
					storeData(newToDos);
				},
			},
		]);
	};

	return (
		<View style={styles.container}>
			<StatusBar style="light" />
			<View style={styles.header}>
				<TouchableOpacity onPress={work}>
					<Text
						style={{
							...styles.buttonText,
							color: working ? "white" : theme.grey,
						}}>
						Work
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={travel}>
					<Text
						style={{
							...styles.buttonText,
							color: working ? theme.grey : "white",
						}}>
						Travel
					</Text>
				</TouchableOpacity>
			</View>
			<View>
				<TextInput
					returnKeyType="done"
					onSubmitEditing={addTodo}
					onChangeText={onChangeText}
					// multiline
					value={text}
					placeholderTextColor="green"
					placeholder={
						working
							? "Click here & add TODO! (^0^)/"
							: "Where do you want to go? ('3')/"
					}
					style={styles.input}
				/>
				<ScrollView style={styles.scrollView}>
					{Object.keys(toDos).map((key) =>
						toDos[key].working === working ? (
							<View
								key={key}
								style={styles.toDo}>
								<Text style={styles.toDoText}>{toDos[key].text}</Text>
								<TouchableOpacity
									onPress={() => {
										deleteTodo(key);
									}}>
									<View style={{}}>
										<Fontisto
											name="trash"
											size={20}
											color="red"
										/>
									</View>
								</TouchableOpacity>
							</View>
						) : null
					)}
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.background,
		padding: "50px 10px",
		paddingHorizontal: "20px",
	},
	header: {
		justifyContent: "space-between",
		flexDirection: "row",
		marginTop: 100,
	},
	buttonText: {
		color: "white",
		fontSize: 44,
		fontWeight: "600",
	},
	input: {
		backgroundColor: theme.inputBox,
		fontSize: 18,
		paddingHorizontal: 20,
		borderRadius: 30,
		marginVertical: 20,
		paddingVertical: 10,
	},
	toDo: {
		backgroundColor: theme.grey,
		marginBottom: 10,
		paddingVertical: 30,
		paddingHorizontal: 40,
		borderRadius: 15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	toDoText: {
		color: "white",
		fontSize: 18,
		fontWeight: 500,
		width: SCREEN_WIDTH * 0.6,
	},
	scrollView: {
		marginHorizontal: 10,
		paddingBottom: 100,
		maxHeight: SCREEN_HEIGHT * 0.7,
	},
});
