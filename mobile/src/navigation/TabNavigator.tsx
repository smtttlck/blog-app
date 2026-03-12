import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../types/NavigationTypes";
import { routes } from "../constants/routes";
import { colors } from "../constants/color";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { iconNameConverter, imgPathConverter } from "../utils/helpers";
import fonts from "../constants/fonts";
import { useAppSelector } from "../redux/app/hooks";
import { Image } from "react-native";

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {

    const user = useAppSelector((state) => state.user);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarLabelStyle: { // label text style
                    fontSize: fonts.size.xsm,
                    fontFamily: fonts.fontFamily,
                    fontWeight: fonts.weight.medium,
                },
                tabBarStyle: { // tab bar style
                    backgroundColor: colors.white,
                    borderTopColor: colors.black2,
                    borderTopWidth: 0.5,
                    position: "absolute",
                    bottom: 10,
                    elevation: 5,
                    shadowColor: colors.black,
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    borderRadius: 20,
                    height: 60,
                    width: '85%',
                    marginHorizontal: "7.5%",
                },
                tabBarActiveTintColor: colors.black,
                tabBarIcon: ({ color, size }) => {
                    return (route.name === "MyProfile" && user.user?.picture_path) 
                        ? <Image source={{ uri: imgPathConverter(user.user.picture_path) }} style={{ width: size * 1.2, height: size * 1.1, borderRadius: (size * 1.2) / 2 }} />
                        : <Icon name={iconNameConverter(route.name)} size={size * 1.2} color={color} />;
                },
            })}
        >
            {routes.filter(route => route.isTabRoute).map(route => (
                <Tab.Screen
                    key={route.name}
                    name={route.name as keyof TabParamList}
                    component={route.component}
                />
            ))}
        </Tab.Navigator>
    )
};

export default TabNavigator;

