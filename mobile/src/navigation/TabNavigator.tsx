import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../types/NavigationTypes";
import { routes } from "../constants/routes";
import { colors } from "../constants/color";
import { MaterialCommunityIcons  as Icon } from '@expo/vector-icons';
import { iconNameConverter } from "../utils/helpers";

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.black2 },
                tabBarActiveTintColor: colors.black,
                tabBarIcon: ({ color, size }) => {
                    return <Icon name={iconNameConverter(route.name)} size={size * 1.3} color={color} />;
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