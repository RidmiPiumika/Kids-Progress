import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function Home() {
    const navigation = useNavigation();
    const tabs = [
        {
            url: require("./../images/1.jpg"),
            name: "Tab 1",
        },
        {
            url: require("./../images/2.jpg"),
            name: "Tab 2",
        },
        {
            url: require("./../images/3.jpg"),
            name: "Tab 3",
        },
        {
            url: require("./../images/4.jpg"),
            name: "Tab 4",
        },
        {
            url: require("./../images/songImage.jpg"),
            name: "Tab 5",
        },
        {
            url: require("./../images/songImage.jpg"),
            name: "Tab 6",
        },
    ];
    const [activeTab, setActiveTab] = useState(tabs[0].name);
    const handleTabPress = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {tabs.map((tab, key) => (
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.tabButton,
                                activeTab === tab?.name && styles.activeTab,
                            ]}
                            onPress={() => handleTabPress(tab?.name)}
                        >
                            <Image style={styles.tabImage} source={tab.url} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            

            <Image
                style={styles.image}
                source={require("./../images/homePageImages.png")}
            />

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Counting Number')}>
                <Text style={styles.buttonText}>Counting Number</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Making Sentance')}>
                <Text style={styles.buttonText}>Making Sentences</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0.8,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#4F1964',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    tabButton: {
        padding: 5,
        borderRadius: 80,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 10,
        height: 80,
        width: 80,
    },
    tabImage: {
        width: 68,
        height: 68,
        borderRadius: 60,
    },
    activeTab: {
        backgroundColor: "",
        borderColor: "#4F1964",
    },
    tabsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
});
