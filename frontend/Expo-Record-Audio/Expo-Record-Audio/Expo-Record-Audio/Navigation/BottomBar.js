import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Platform } from "react-native";
import { StyleSheet } from "react-native";
import { useLayoutEffect, useState } from "react";
import Dashboard from "../pages/Dashboard";
import GrossMotor from "../pages/GrossMotor";
import FineMotor from "../pages/FineMotor";
import Home from "../pages/Home";
import SocialBehaviour from "../pages/SocialBehaviour";


const Tab = createBottomTabNavigator();
const iconSize = 28;

const screenOptions = {
  tabBarLabelStyle: {
    fontSize: 14,
  },
  tabBarStyle: {
    height: 60,
  },
};

export default function BottomBar({ navigation }) {
  const [header, setHeader] = useState("Kids Progress");
  const [isMenuVisible, setMenuVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: header,
      headerStyle: {
        backgroundColor: "#4F1964",
      },
      headerTintColor: "white",
      headerRight: () => (
        <TouchableOpacity onPress={() => openMenu()}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={28}
            color="white"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const iconColor = (focused) => {
    if (focused) {
      return "#4F1964";
    } else {
      return "black";
    }
  };

  const openMenu = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleBackdropPress = () => {
    closeMenu();
  };

  const navigateTo = (value) => {
    closeMenu();
    navigation.navigate(value);
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name="Tab 1"
          component={FineMotor}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <MaterialCommunityIcons
                    name="drawing"
                    size={iconSize}
                    color={iconColor(focused)}
                  />
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="Tab 2"
          component={GrossMotor}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <MaterialCommunityIcons
                    name="run"
                    size={iconSize}
                    color={iconColor(focused)}
                  />
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={styles.homeTab}>
                  <Entypo name="home" size={34} color={iconColor(focused)} />
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="Tab 3"
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <MaterialCommunityIcons
                    name="microphone"
                    size={iconSize}
                    color={iconColor(focused)}
                  />
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="Tab 4"
          component={SocialBehaviour}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <MaterialCommunityIcons
                    name="human-child"
                    size={iconSize}
                    color={iconColor(focused)}
                  />
                </View>
              );
            },
          }}
        />
      </Tab.Navigator>

      {isMenuVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isMenuVisible}
          onRequestClose={closeMenu}
        >
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={styles.menuContainer}>
              <View style={styles.menu}>
                <TouchableOpacity
                  onPress={() => {
                    navigateTo("myProfile");
                  }}
                >
                  <Text style={styles.menuText}>My Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigateTo("myProfile");
                  }}
                >
                  <Text style={styles.menuText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeMenu}>
                  <Text style={styles.menuText}>Give Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeMenu}>
                  <Text style={styles.menuText}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeMenu}>
                  <Text style={styles.menuText}>About App</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  homeTab: {
    top: Platform.OS == "ios" ? -10 : -20,
    width: Platform.OS == "ios" ? 50 : 60,
    height: Platform.OS == "ios" ? 50 : 60,
    borderRadius: Platform.OS == "ios" ? 25 : 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B033A8",
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  menu: {
    backgroundColor: "white",
    padding: 20,
    position: "absolute",
    top: 60,
    left: 200,
    right: 5,
    borderRadius: 10,
    borderColor: "#bbbcbd",
    borderStyle: "solid",
    borderWidth: 1,
  },
  menuText: {
    fontSize: 20,
    paddingVertical: 10,
  },
});
