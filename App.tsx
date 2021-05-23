import 'react-native-gesture-handler';
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useRef, useState, useEffect} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Button,
  ListRenderItem,
  Image,
  TextInputChangeEventData,
  NativeSyntheticEvent,
  KeyboardType,
} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {
  CardField,
  CardFieldInput,
  StripeProvider,
  useStripe,
} from '@stripe/stripe-react-native';

interface StepItem {
  step: string;
  time?: number;
  id: string;
}

const ChickenPiccataRecipe: StepItem[] = [
  {
    step: '1.	For the noodles, fill a pot of water and a pinch of salt and place over high heat to bring to a boil.',
    id: '1',
  },
  {
    step: '2.	Turn the heat on the pan up to medium heat and add the olive oil and one slice of butter to the pan and wait until it starts to bubble.',
    id: '2',
  },
  {
    step: '3.	Place the chicken into the pan and cook for 3 minutes on each side or until the side has browned. (Use the tongs to lift the chicken and check for browning). Once the chicken is cooked place it on the plate.',
    time: 6,
    id: '3',
  },
  {
    step: '4.	The water should now be boiling, add the noodles to the boiling water.',
    id: '4',
  },
  {step: '5.	Remove the pan from the heat.', id: '5'},
  {
    step: '6.	Add the flour to the pan and the lemon, chicken broth, and capers mixture to the pan',
    id: '6',
  },
  {
    step: '7.	Using the whisk, mix the sauce components that you added to the pan.',
    id: '7',
  },
  {
    step: '8.	Using the tongs add the chicken back to the pan and turn the heat down to a simmer. ',
    id: '8',
  },
  {
    step: '9.	Let sit for 3 minutes. There should be some thick liquid with honey like consistency left on the pan or stuck to the chicken. Remove the chicken and place it on the plate.',
    time: 3,
    id: '9',
  },
  {
    step: '10.	Add the remaining slice of butter and whisk it into the sauce.',
    id: '10',
  },
  {
    step: '11.	Drain the noodles then plate them in a pile using the tongs.',
    id: '11',
  },
  {
    step: '12.	Place chicken on top of the noodles and then pour sauce on top.',
    id: '12',
  },
  {
    step: '13.	Pour the parsley olive oil over the dish to garnish.',
    id: '13',
  },
];

const RecipeRepository: {[key: string]: StepItem[]} = {
  '1': ChickenPiccataRecipe,
  '2': ChickenPiccataRecipe,
  '3': ChickenPiccataRecipe,
  '4': ChickenPiccataRecipe,
};

interface MenuItem {
  name: string;
  id: string;
  thumbnail: string;
  description: string;
  price: number;
}

const Menu: MenuItem[] = [
  {
    id: '1',
    name: 'Chicken Piccata',
    thumbnail:
      'https://www.momontimeout.com/wp-content/uploads/2020/10/easy-chicken-piccata-recipe-square.jpg',
    price: 10,
    description:
      'Chicken Piccata is a dish that features meat pounded thin and topped with a buttery lemon caper sauce served over noodles.',
  },
  {
    id: '2',
    name: 'Spaghetti And Meatballs',
    thumbnail:
      'https://foodtasia.com/wp-content/uploads/2019/09/spaghetti-meatballs-28.jpg',
    price: 10,
    description:
      'A classic italian dish with spaghetti, red sauce, and homemade meatballs',
  },
  {
    id: '3',
    name: 'Veggie Quesidilla',
    thumbnail:
      'https://onepotrecipes.com/wp-content/uploads/2019/06/Vegetable-and-Cheese-Quesadilla.jpg',
    price: 10,
    description: 'A simple mexican dish filled with veggies, cheese, and spice',
  },
  {
    id: '4',
    name: 'Italian Sandwhich',
    thumbnail:
      'https://www.fifteenspatulas.com/wp-content/uploads/2015/12/Italian-Club-Sandwich-Fifteen-Spatulas-1-640x427.jpg',
    price: 10,
    description:
      'The italian sandwhich contains lots of cured meats and fresh vegetables.',
  },
];

interface Ingredient {
  id: string;
  name: string;
  count: number;
}

const IngredientListRepository: {[key: string]: Ingredient[]} = {
  '1': [
    {
      id: '1',
      name: 'Chicken Breast, flattened, seasoned, and floured',
      count: 1,
    },
    {
      id: '2',
      name: 'Picatta Sauce Base',
      count: 1,
    },
    {
      id: '3',
      name: 'Parsley infused olive oil',
      count: 1,
    },
    {
      id: '4',
      name: 'Slices of 1 tbsp of butter',
      count: 2,
    },
    {
      id: '5',
      name: 'Tbsp of olive oil',
      count: 1,
    },
    {
      id: '6',
      name: 'Serving of noodles',
      count: 1,
    },
    {
      id: '7',
      name: 'Tbsp of flour',
      count: 1,
    },
  ],
  '2': [
    {
      id: '8',
      name: 'Tsp of olive oil',
      count: 1,
    },
  ],
  '3': [
    {
      id: '8',
      name: 'Tsp of olive oil',
      count: 1,
    },
  ],
  '4': [
    {
      id: '8',
      name: 'Tsp of olive oil',
      count: 1,
    },
  ],
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <StripeProvider merchantIdentifier="adaptsolutions" publishableKey={'A'}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="menu">
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Menu Item" component={MenuItemScreen} />
          <Stack.Screen name="Order" component={OrderScreen} />
          <Stack.Screen name="Recipe" component={RecipeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
};

const MenuScreen = () => {
  const renderRecipes: ListRenderItem<MenuItem> = ({item}) => {
    return <MenuItem {...item} />;
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Recipes</Text>
      <FlatList
        data={Menu}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={renderRecipes}
      />
    </SafeAreaView>
  );
};

const MenuItem: React.FC<MenuItem> = ({name, id, thumbnail, description}) => {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity
        style={{padding: 10}}
        onPress={() =>
          navigation.navigate(`Menu Item`, {
            item: {name, id, thumbnail, description},
          })
        }>
        <View>
          <Image
            style={styles.menuThumbnail}
            source={{
              uri: thumbnail,
            }}
          />
        </View>
        <Text style={styles.recipeText}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
};

interface MenuItemScreenProps {
  params: {
    item: MenuItem;
  };
}

const MenuItemScreen = () => {
  const {params} = useRoute() as MenuItemScreenProps;
  const navigation = useNavigation();

  const navigateToOrderScreen = () => {
    navigation.navigate('Order', {
      id: params.item.id,
      item: params.item,
    });
  };

  const navigateToRecipeScreen = () => {
    navigation.navigate('Recipe', {
      id: params.item.id,
      menuItem: params.item,
    });
  };

  return (
    <ScrollView>
      <Image
        style={styles.menuThumbnail}
        source={{
          uri: params.item.thumbnail,
        }}
      />
      <Text style={styles.title}>{params.item.name}</Text>
      <Text style={styles.description}>{params.item.description}</Text>
      <View style={styles.button}>
        <Button title="Order" onPress={navigateToOrderScreen} />
      </View>
      <IngredientList itemId={params.item.id} />
      <View style={styles.button}>
        <Button title="Recipe" onPress={navigateToRecipeScreen} />
      </View>
    </ScrollView>
  );
};

interface IngredientListProps {
  itemId: string;
}

const IngredientList: React.FC<IngredientListProps> = ({itemId}) => {
  return (
    <View style={styles.ingredientListView}>
      <Text style={styles.recipeText}>Ingredient List</Text>
      {IngredientListRepository[itemId].map(item => (
        <IngredientListItem key={item.id} {...item} />
      ))}
    </View>
  );
};

const IngredientListItem: React.FC<Ingredient> = ({name, count}) => {
  return (
    <View>
      <Text style={styles.step}>
        {count} {name}
      </Text>
    </View>
  );
};

interface OrderScreenProps {
  params: {
    id: string;
    item: MenuItem;
  };
}

const OrderScreen = () => {
  const {params} = useRoute() as OrderScreenProps;
  const [card, setCard] = useState<CardFieldInput.Details | null>(null);
  const {confirmPayment, handleCardAction} = useStripe();

  return (
    <ScrollView>
      <Text style={styles.title}>Place Your Order</Text>
      <Text style={styles.subheading}>
        Enter your information to have your meal delivered to you
      </Text>
      <Image
        style={styles.menuThumbnail}
        source={{
          uri: params.item.thumbnail,
        }}
      />
      <Text style={styles.title}>{params.item.name}</Text>
      <Text style={styles.description}>{params.item.price}</Text>
      <Text style={styles.recipeText}>Contact Information</Text>
      <Input keyboardType="default" label="Name" onChange={() => {}} />
      <Input
        keyboardType="phone-pad"
        label="Phone Number"
        onChange={() => {}}
      />
      <Text style={styles.recipeText}>Address</Text>
      <Input
        keyboardType="default"
        label="Address Line 1"
        onChange={() => {}}
      />
      <Input
        keyboardType="default"
        label="Address Line 2"
        onChange={() => {}}
      />
      <Input keyboardType="default" label="City" onChange={() => {}} />
      <View style={{flexDirection: 'row'}}>
        <Input keyboardType="default" label="State" onChange={() => {}} />
        <Input keyboardType="numeric" label="Zip Code" onChange={() => {}} />
      </View>
      <Text style={styles.recipeText}>Billing Information</Text>
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={cardDetails => {
          setCard(cardDetails);
        }}
      />
      <View style={styles.button}>
        <Button title="Place Order" onPress={() => {}} />
      </View>
    </ScrollView>
  );
};

interface InputProps {
  label: string;
  keyboardType: KeyboardType;
  onChange: (value: NativeSyntheticEvent<TextInputChangeEventData>) => void;
}

const Input: React.FC<InputProps> = ({label, onChange, keyboardType}) => {
  return (
    <View style={styles.inputView}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        onChange={onChange}
        style={styles.input}
      />
    </View>
  );
};

interface RecipeScreenProps {
  params: {
    id: string;
    menuItem: MenuItem;
  };
}

const RecipeScreen = () => {
  const [activeIndex, setActive] = useState(0);
  const {params} = useRoute() as RecipeScreenProps;

  const renderSteps: ListRenderItem<StepItem> = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity onPress={() => setActive(index)}>
          <Step
            active={activeIndex === index}
            step={item.step}
            time={item.time}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        keyExtractor={item => item.id}
        data={RecipeRepository[params.id]}
        renderItem={renderSteps}
        ListHeaderComponent={<StepListHeader menuItem={params.menuItem} />}
      />
    </SafeAreaView>
  );
};

interface StepProps {
  step: string;
  time?: number;
  active: boolean;
}

const Step: React.FC<StepProps> = ({step, time, active}) => {
  if (active) {
    return (
      <View style={styles.stepViewActive}>
        {time !== undefined ? (
          <>
            <Text style={styles.stepActive}>{step}</Text>
            <Timer minutes={time} />
          </>
        ) : (
          <Text style={styles.stepActive}>{step}</Text>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.stepView}>
        {time !== undefined ? (
          <>
            <Text style={styles.step}>{step}</Text>
            <Timer minutes={time} />
          </>
        ) : (
          <Text style={styles.step}>{step}</Text>
        )}
      </View>
    );
  }
};

const formatTime = (time: number) => {
  const getSeconds = `0${time % 60}`.slice(-2);
  const minutes = Math.floor(time / 60);
  const getMinutes = `0${minutes % 60}`.slice(-2);
  const getHours = `0${Math.floor(time / 3600)}`.slice(-2);

  return `${getHours} : ${getMinutes} : ${getSeconds}`;
};

interface TimerProps {
  minutes: number;
}

const Timer: React.FC<TimerProps> = ({minutes}) => {
  const {start, stop, time, isCountingDown} = useTimer(minutes);

  useEffect(() => {
    return stop;
  }, []);

  return (
    <View style={styles.timerView}>
      <Text style={styles.timerText}>{formatTime(time)}</Text>
      {!isCountingDown ? (
        <TouchableOpacity style={styles.timerButton} onPress={start}>
          <Text style={styles.timerButtonText}>Start</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.timerButton} onPress={stop}>
          <Text style={styles.timerButtonText}>Stop</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const useTimer = (initialTime = 0) => {
  const [time, setTime] = useState(initialTime * 60);
  const [isCountingDown, setRunning] = useState(false);
  const [hasAlertedUser, setHasAlerted] = useState(false);
  const intervalRef: React.MutableRefObject<NodeJS.Timeout | null> =
    useRef<NodeJS.Timeout>(null);

  const start = () => {
    if (!isCountingDown && time > 0) {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    }
  };

  const stop = () => {
    if (intervalRef.current) {
      console.log('here?');
      clearInterval(intervalRef.current);
    }
    if (isCountingDown) {
      setRunning(false);
    }
  };

  if (intervalRef.current && time <= 0 && !hasAlertedUser) {
    Alert.alert('Timer done', 'Timer has completed!', [
      {
        text: 'Ok',
      },
    ]);
    clearInterval(intervalRef.current);
    setHasAlerted(true);
  }

  return {start, stop, time, isCountingDown};
};

interface StepListHeaderProps {
  menuItem: MenuItem;
}

const StepListHeader: React.FC<StepListHeaderProps> = ({menuItem}) => {
  return (
    <View>
      <Text style={styles.title}>{menuItem.name}</Text>
      <Text style={styles.description}>{menuItem.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: '700',
    marginVertical: 20,
  },
  description: {
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 20,
    color: 'rgb(130, 130, 130)',
  },
  timerView: {
    padding: 15,
    width: '100%',
    justifyContent: 'center',
  },
  timerText: {
    color: 'rgb(10, 100, 250)',
    fontSize: 24,
    marginVertical: 10,
    textAlign: 'center',
  },
  timerButton: {
    width: 175,
    fontSize: 18,
    alignSelf: 'center',
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
  },
  timerButtonText: {
    textAlign: 'center',
    fontSize: 18,
  },
  step: {
    fontSize: 18,
    paddingHorizontal: 15,
    lineHeight: 30,
    color: 'black',
  },
  stepView: {
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  stepViewActive: {
    paddingVertical: 20,
    backgroundColor: 'black',
  },
  stepActive: {
    color: 'white',
    fontSize: 18,
    paddingHorizontal: 15,
    lineHeight: 30,
  },
  menuThumbnail: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    alignSelf: 'center',
    margin: 10,
  },
  recipeText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
    alignSelf: 'center',
    margin: 10,
  },
  ingredientListView: {
    margin: 25,
  },
  button: {
    width: '50%',
    marginVertical: 25,
    alignSelf: 'center',
  },
  inputView: {
    marginHorizontal: 50,
    marginVertical: 15,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    fontSize: 16,
    padding: 0,
    borderBottomColor: 'black',
  },
  label: {
    fontSize: 14,
    marginVertical: 5,
    color: 'rgb(80, 80, 80)',
  },
  subheading: {
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 10,
    color: 'rgb(130, 130, 130)',
  },
});

export default App;
