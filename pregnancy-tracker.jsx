import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  Textarea,
  Grid,
  Badge,
  IconButton,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Flex,
  Divider,
  Select,
  extendTheme,
} from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Custom theme with distinctive aesthetic - Warm, nurturing, organic feel
const theme = extendTheme({
  fonts: {
    heading: '"Playfair Display", serif',
    body: '"Crimson Text", serif',
  },
  colors: {
    brand: {
      50: '#fff5f5',
      100: '#ffe0e0',
      200: '#ffc7c7',
      300: '#ffa3a3',
      400: '#ff7a7a',
      500: '#ff5252',
      600: '#e04848',
      700: '#c23d3d',
      800: '#a33333',
      900: '#852929',
    },
    sage: {
      50: '#f4f7f5',
      100: '#e5ede8',
      200: '#d1e0d6',
      300: '#b3cebb',
      400: '#8fb89a',
      500: '#6e9c7d',
      600: '#578066',
      700: '#476654',
      800: '#3a5345',
      900: '#314439',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'linear-gradient(135deg, #fff5f5 0%, #f4f7f5 100%)',
        color: 'gray.800',
      },
    },
  },
});

// IndexedDB helper functions
const DB_NAME = 'PregnancyTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'dailyEntries';

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('date', 'date', { unique: false });
      }
    };
  });
};

const addEntry = async (entry) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.add(entry);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getAllEntries = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const deleteEntry = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Main App Component
export default function PregnancyTrackerApp() {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    bloodSugar: '',
    weight: '',
    foodIntake: '',
    waterIntake: '',
    mood: '',
    symptoms: '',
    fetalMovement: '',
    notes: '',
  });
  
  const toast = useToast();

  useEffect(() => {
    loadEntries();
    registerServiceWorker();
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/service-worker.js');
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  };

  const loadEntries = async () => {
    try {
      const allEntries = await getAllEntries();
      setEntries(allEntries.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEntry({
        ...formData,
        timestamp: new Date().toISOString(),
      });
      
      toast({
        title: 'Entry saved successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        bloodSugar: '',
        weight: '',
        foodIntake: '',
        waterIntake: '',
        mood: '',
        symptoms: '',
        fetalMovement: '',
        notes: '',
      });
      
      loadEntries();
    } catch (error) {
      toast({
        title: 'Error saving entry',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id);
      toast({
        title: 'Entry deleted',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
      loadEntries();
    } catch (error) {
      toast({
        title: 'Error deleting entry',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Prepare data for charts
  const chartData = entries
    .slice(0, 30)
    .reverse()
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: parseFloat(entry.weight) || 0,
      bloodPressureSystolic: parseInt(entry.bloodPressureSystolic) || 0,
      bloodSugar: parseFloat(entry.bloodSugar) || 0,
    }));

  const getAverages = () => {
    if (entries.length === 0) return {};
    
    const recent = entries.slice(0, 7);
    return {
      avgWeight: (recent.reduce((sum, e) => sum + (parseFloat(e.weight) || 0), 0) / recent.length).toFixed(1),
      avgBP: Math.round(recent.reduce((sum, e) => sum + (parseInt(e.bloodPressureSystolic) || 0), 0) / recent.length),
      avgSugar: (recent.reduce((sum, e) => sum + (parseFloat(e.bloodSugar) || 0), 0) / recent.length).toFixed(1),
    };
  };

  const averages = getAverages();

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" py={8}>
        {/* Header with decorative elements */}
        <Box 
          bg="white" 
          boxShadow="0 4px 20px rgba(0,0,0,0.08)"
          borderBottom="3px solid"
          borderColor="brand.200"
          mb={8}
          position="sticky"
          top={0}
          zIndex={10}
          backdropFilter="blur(10px)"
          bgGradient="linear(to-r, rgba(255,245,245,0.95), rgba(244,247,245,0.95))"
        >
          <Container maxW="container.xl" py={6}>
            <Flex align="center" justify="space-between">
              <Box>
                <Heading 
                  size="2xl" 
                  bgGradient="linear(to-r, brand.500, sage.600)"
                  bgClip="text"
                  fontWeight="bold"
                  letterSpacing="-0.02em"
                >
                  Pregnancy Tracker
                </Heading>
                <Text fontSize="lg" color="gray.600" fontStyle="italic" mt={1}>
                  Your journey, beautifully documented
                </Text>
              </Box>
              <Badge 
                colorScheme="pink" 
                fontSize="lg" 
                px={4} 
                py={2} 
                borderRadius="full"
                boxShadow="0 2px 10px rgba(255,82,82,0.2)"
              >
                {entries.length} Entries
              </Badge>
            </Flex>
          </Container>
        </Box>

        <Container maxW="container.xl">
          <Tabs colorScheme="brand" variant="soft-rounded" size="lg">
            <TabList mb={8} bg="white" p={2} borderRadius="full" boxShadow="0 2px 15px rgba(0,0,0,0.05)">
              <Tab _selected={{ bg: 'brand.500', color: 'white' }} fontWeight="semibold">📝 New Entry</Tab>
              <Tab _selected={{ bg: 'sage.500', color: 'white' }} fontWeight="semibold">📊 Dashboard</Tab>
              <Tab _selected={{ bg: 'brand.400', color: 'white' }} fontWeight="semibold">📖 History</Tab>
            </TabList>

            <TabPanels>
              {/* New Entry Tab */}
              <TabPanel>
                <Card 
                  bg="white" 
                  boxShadow="0 8px 30px rgba(0,0,0,0.08)" 
                  borderRadius="2xl"
                  border="2px solid"
                  borderColor="brand.100"
                >
                  <CardBody p={8}>
                    <form onSubmit={handleSubmit}>
                      <VStack spacing={6} align="stretch">
                        <Heading size="lg" color="brand.600" mb={4}>
                          Daily Log Entry
                        </Heading>
                        
                        <Box>
                          <Text fontWeight="semibold" mb={2} color="gray.700">Date</Text>
                          <Input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            size="lg"
                            borderColor="brand.200"
                            _hover={{ borderColor: 'brand.300' }}
                            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                        </Box>

                        <Divider borderColor="brand.100" />

                        <Heading size="md" color="sage.700">Vitals</Heading>
                        
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <Box>
                            <Text fontWeight="semibold" mb={2} color="gray.700">Systolic BP (mmHg)</Text>
                            <Input
                              type="number"
                              name="bloodPressureSystolic"
                              placeholder="120"
                              value={formData.bloodPressureSystolic}
                              onChange={handleInputChange}
                              size="lg"
                              borderColor="sage.200"
                              _hover={{ borderColor: 'sage.300' }}
                              _focus={{ borderColor: 'sage.500', boxShadow: '0 0 0 1px var(--chakra-colors-sage-500)' }}
                            />
                          </Box>
                          
                          <Box>
                            <Text fontWeight="semibold" mb={2} color="gray.700">Diastolic BP (mmHg)</Text>
                            <Input
                              type="number"
                              name="bloodPressureDiastolic"
                              placeholder="80"
                              value={formData.bloodPressureDiastolic}
                              onChange={handleInputChange}
                              size="lg"
                              borderColor="sage.200"
                              _hover={{ borderColor: 'sage.300' }}
                              _focus={{ borderColor: 'sage.500', boxShadow: '0 0 0 1px var(--chakra-colors-sage-500)' }}
                            />
                          </Box>
                          
                          <Box>
                            <Text fontWeight="semibold" mb={2} color="gray.700">Blood Sugar (mg/dL)</Text>
                            <Input
                              type="number"
                              step="0.1"
                              name="bloodSugar"
                              placeholder="95"
                              value={formData.bloodSugar}
                              onChange={handleInputChange}
                              size="lg"
                              borderColor="sage.200"
                              _hover={{ borderColor: 'sage.300' }}
                              _focus={{ borderColor: 'sage.500', boxShadow: '0 0 0 1px var(--chakra-colors-sage-500)' }}
                            />
                          </Box>
                          
                          <Box>
                            <Text fontWeight="semibold" mb={2} color="gray.700">Weight (kg)</Text>
                            <Input
                              type="number"
                              step="0.1"
                              name="weight"
                              placeholder="65.5"
                              value={formData.weight}
                              onChange={handleInputChange}
                              size="lg"
                              borderColor="sage.200"
                              _hover={{ borderColor: 'sage.300' }}
                              _focus={{ borderColor: 'sage.500', boxShadow: '0 0 0 1px var(--chakra-colors-sage-500)' }}
                            />
                          </Box>
                        </Grid>

                        <Divider borderColor="brand.100" />

                        <Heading size="md" color="sage.700">Daily Activities</Heading>

                        <Box>
                          <Text fontWeight="semibold" mb={2} color="gray.700">Water Intake (glasses)</Text>
                          <Input
                            type="number"
                            name="waterIntake"
                            placeholder="8"
                            value={formData.waterIntake}
                            onChange={handleInputChange}
                            size="lg"
                            borderColor="blue.200"
                            _hover={{ borderColor: 'blue.300' }}
                            _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                          />
                        </Box>

                        <Box>
                          <Text fontWeight="semibold" mb={2} color="gray.700">Mood</Text>
                          <Select
                            name="mood"
                            placeholder="Select your mood"
                            value={formData.mood}
                            onChange={handleInputChange}
                            size="lg"
                            borderColor="brand.200"
                            _hover={{ borderColor: 'brand.300' }}
                            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          >
                            <option value="😊 Great">😊 Great</option>
                            <option value="🙂 Good">🙂 Good</option>
                            <option value="😐 Okay">😐 Okay</option>
                            <option value="😔 Tired">😔 Tired</option>
                            <option value="😰 Anxious">😰 Anxious</option>
                          </Select>
                        </Box>

                        <Box>
                          <Text fontWeight="semibold" mb={2} color="gray.700">Food Intake (meals & snacks)</Text>
                          <Textarea
                            name="foodIntake"
                            placeholder="Breakfast: Oatmeal with berries&#10;Lunch: Grilled chicken salad&#10;Snack: Apple with peanut butter"
                            value={formData.foodIntake}
                            onChange={handleInputChange}
                            rows={4}
                            size="lg"
                            borderColor="brand.200"
                            _hover={{ borderColor: 'brand.300' }}
                            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                        </Box>

                        <Box>
                          <Text fontWeight="semibold" mb={2} color="gray.700">Symptoms</Text>
                          <Textarea
                            name="symptoms"
                            placeholder="Any symptoms or discomfort you experienced today..."
                            value={formData.symptoms}
                            onChange={handleInputChange}
                            rows={3}
                            size="lg"
                            borderColor="brand.200"
                            _hover={{ borderColor: 'brand.300' }}
                            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                        </Box>

                        <Box>
                          <Text fontWeight="semibold" mb={2} color="gray.700">Fetal Movement</Text>
                          <Input
                            name="fetalMovement"
                            placeholder="Kicks, movements, patterns..."
                            value={formData.fetalMovement}
                            onChange={handleInputChange}
                            size="lg"
                            borderColor="brand.200"
                            _hover={{ borderColor: 'brand.300' }}
                            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                        </Box>

                        <Box>
                          <Text fontWeight="semibold" mb={2} color="gray.700">Additional Notes</Text>
                          <Textarea
                            name="notes"
                            placeholder="Any other observations, thoughts, or questions for your doctor..."
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            size="lg"
                            borderColor="brand.200"
                            _hover={{ borderColor: 'brand.300' }}
                            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          />
                        </Box>

                        <Button
                          type="submit"
                          colorScheme="brand"
                          size="lg"
                          fontSize="xl"
                          h="60px"
                          mt={4}
                          bgGradient="linear(to-r, brand.500, brand.600)"
                          _hover={{ 
                            bgGradient: "linear(to-r, brand.600, brand.700)",
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(255,82,82,0.3)'
                          }}
                          transition="all 0.3s"
                        >
                          💕 Save Entry
                        </Button>
                      </VStack>
                    </form>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Dashboard Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Stats Overview */}
                  <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
                    <Card 
                      bg="white" 
                      boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                      borderRadius="xl"
                      borderLeft="6px solid"
                      borderColor="brand.400"
                    >
                      <CardBody>
                        <Stat>
                          <StatLabel fontSize="md" color="gray.600">Avg Weight (7 days)</StatLabel>
                          <StatNumber fontSize="3xl" color="brand.600">{averages.avgWeight || 'N/A'} kg</StatNumber>
                          <StatHelpText>Based on recent entries</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    
                    <Card 
                      bg="white" 
                      boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                      borderRadius="xl"
                      borderLeft="6px solid"
                      borderColor="sage.400"
                    >
                      <CardBody>
                        <Stat>
                          <StatLabel fontSize="md" color="gray.600">Avg Blood Pressure</StatLabel>
                          <StatNumber fontSize="3xl" color="sage.600">{averages.avgBP || 'N/A'} mmHg</StatNumber>
                          <StatHelpText>Systolic (7 days)</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    
                    <Card 
                      bg="white" 
                      boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                      borderRadius="xl"
                      borderLeft="6px solid"
                      borderColor="blue.400"
                    >
                      <CardBody>
                        <Stat>
                          <StatLabel fontSize="md" color="gray.600">Avg Blood Sugar</StatLabel>
                          <StatNumber fontSize="3xl" color="blue.600">{averages.avgSugar || 'N/A'} mg/dL</StatNumber>
                          <StatHelpText>7-day average</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                  </Grid>

                  {/* Charts */}
                  {chartData.length > 0 && (
                    <>
                      <Card 
                        bg="white" 
                        boxShadow="0 8px 30px rgba(0,0,0,0.08)" 
                        borderRadius="2xl"
                        p={6}
                      >
                        <Heading size="md" mb={6} color="brand.600">Weight Trend</Heading>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '2px solid #ff5252',
                                borderRadius: '12px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                              }} 
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="weight" 
                              stroke="#ff5252" 
                              strokeWidth={3}
                              dot={{ fill: '#ff5252', r: 5 }}
                              activeDot={{ r: 7 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Card>

                      <Card 
                        bg="white" 
                        boxShadow="0 8px 30px rgba(0,0,0,0.08)" 
                        borderRadius="2xl"
                        p={6}
                      >
                        <Heading size="md" mb={6} color="sage.600">Blood Pressure Trend</Heading>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '2px solid #6e9c7d',
                                borderRadius: '12px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                              }} 
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="bloodPressureSystolic" 
                              stroke="#6e9c7d" 
                              strokeWidth={3}
                              dot={{ fill: '#6e9c7d', r: 5 }}
                              activeDot={{ r: 7 }}
                              name="Systolic"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Card>

                      <Card 
                        bg="white" 
                        boxShadow="0 8px 30px rgba(0,0,0,0.08)" 
                        borderRadius="2xl"
                        p={6}
                      >
                        <Heading size="md" mb={6} color="blue.600">Blood Sugar Trend</Heading>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '2px solid #3182ce',
                                borderRadius: '12px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                              }} 
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="bloodSugar" 
                              stroke="#3182ce" 
                              strokeWidth={3}
                              dot={{ fill: '#3182ce', r: 5 }}
                              activeDot={{ r: 7 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Card>
                    </>
                  )}
                </VStack>
              </TabPanel>

              {/* History Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  {entries.length === 0 ? (
                    <Card bg="white" boxShadow="0 4px 20px rgba(0,0,0,0.08)" borderRadius="xl" p={12}>
                      <VStack spacing={4}>
                        <Text fontSize="3xl">📝</Text>
                        <Heading size="md" color="gray.600">No entries yet</Heading>
                        <Text color="gray.500" textAlign="center">
                          Start tracking your pregnancy journey by adding your first entry!
                        </Text>
                      </VStack>
                    </Card>
                  ) : (
                    entries.map((entry) => (
                      <Card 
                        key={entry.id} 
                        bg="white" 
                        boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                        borderRadius="xl"
                        borderLeft="6px solid"
                        borderColor="brand.300"
                        _hover={{ 
                          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.3s'
                        }}
                      >
                        <CardBody p={6}>
                          <Flex justify="space-between" align="start" mb={4}>
                            <Box>
                              <Heading size="md" color="brand.600">
                                {new Date(entry.date).toLocaleDateString('en-US', { 
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Heading>
                              <Text fontSize="sm" color="gray.500" mt={1}>
                                Logged: {new Date(entry.timestamp).toLocaleString()}
                              </Text>
                            </Box>
                            <Button
                              colorScheme="red"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(entry.id)}
                            >
                              Delete
                            </Button>
                          </Flex>
                          
                          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4} mb={4}>
                            {entry.bloodPressureSystolic && (
                              <Box bg="sage.50" p={3} borderRadius="lg">
                                <Text fontSize="sm" color="gray.600" fontWeight="semibold">Blood Pressure</Text>
                                <Text fontSize="lg" color="sage.700" fontWeight="bold">
                                  {entry.bloodPressureSystolic}/{entry.bloodPressureDiastolic} mmHg
                                </Text>
                              </Box>
                            )}
                            
                            {entry.bloodSugar && (
                              <Box bg="blue.50" p={3} borderRadius="lg">
                                <Text fontSize="sm" color="gray.600" fontWeight="semibold">Blood Sugar</Text>
                                <Text fontSize="lg" color="blue.700" fontWeight="bold">
                                  {entry.bloodSugar} mg/dL
                                </Text>
                              </Box>
                            )}
                            
                            {entry.weight && (
                              <Box bg="brand.50" p={3} borderRadius="lg">
                                <Text fontSize="sm" color="gray.600" fontWeight="semibold">Weight</Text>
                                <Text fontSize="lg" color="brand.700" fontWeight="bold">
                                  {entry.weight} kg
                                </Text>
                              </Box>
                            )}
                            
                            {entry.waterIntake && (
                              <Box bg="blue.50" p={3} borderRadius="lg">
                                <Text fontSize="sm" color="gray.600" fontWeight="semibold">Water Intake</Text>
                                <Text fontSize="lg" color="blue.700" fontWeight="bold">
                                  {entry.waterIntake} glasses 💧
                                </Text>
                              </Box>
                            )}
                            
                            {entry.mood && (
                              <Box bg="purple.50" p={3} borderRadius="lg">
                                <Text fontSize="sm" color="gray.600" fontWeight="semibold">Mood</Text>
                                <Text fontSize="lg" color="purple.700" fontWeight="bold">
                                  {entry.mood}
                                </Text>
                              </Box>
                            )}
                          </Grid>
                          
                          {entry.foodIntake && (
                            <Box mb={3}>
                              <Text fontWeight="semibold" color="gray.700" mb={1}>Food Intake:</Text>
                              <Text color="gray.600" whiteSpace="pre-line" bg="orange.50" p={3} borderRadius="lg">
                                {entry.foodIntake}
                              </Text>
                            </Box>
                          )}
                          
                          {entry.symptoms && (
                            <Box mb={3}>
                              <Text fontWeight="semibold" color="gray.700" mb={1}>Symptoms:</Text>
                              <Text color="gray.600" whiteSpace="pre-line" bg="red.50" p={3} borderRadius="lg">
                                {entry.symptoms}
                              </Text>
                            </Box>
                          )}
                          
                          {entry.fetalMovement && (
                            <Box mb={3}>
                              <Text fontWeight="semibold" color="gray.700" mb={1}>Fetal Movement:</Text>
                              <Text color="gray.600" bg="pink.50" p={3} borderRadius="lg">
                                {entry.fetalMovement}
                              </Text>
                            </Box>
                          )}
                          
                          {entry.notes && (
                            <Box>
                              <Text fontWeight="semibold" color="gray.700" mb={1}>Notes:</Text>
                              <Text color="gray.600" whiteSpace="pre-line" bg="gray.50" p={3} borderRadius="lg">
                                {entry.notes}
                              </Text>
                            </Box>
                          )}
                        </CardBody>
                      </Card>
                    ))
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>

        {/* Footer */}
        <Box mt={12} py={6} textAlign="center" color="gray.600">
          <Text fontSize="sm" fontStyle="italic">
            💕 Track your beautiful journey with care and love
          </Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
}
