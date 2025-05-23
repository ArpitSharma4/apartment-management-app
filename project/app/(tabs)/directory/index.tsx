import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, User, ChevronRight, CircleCheck as CheckCircle2, Chrome as Home, Circle as XCircle, PhoneCall, Mail, Filter, ArrowLeft, FileText, File, FileCheck, FileSignature, Zap, Droplet, Edit, MoreVertical, UserCheck, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';

// Dummy data for the directory
const apartmentsData = [
  {
    id: '1',
    number: '101',
    floor: '1',
    type: '2 Bedroom',
    status: 'occupied',
    resident: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      moveInDate: '01/15/2023',
    },
  },
  {
    id: '2',
    number: '102',
    floor: '1',
    type: '1 Bedroom',
    status: 'occupied',
    resident: {
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '(555) 234-5678',
      moveInDate: '03/05/2023',
    },
  },
  {
    id: '3',
    number: '103',
    floor: '1',
    type: 'Studio',
    status: 'vacant',
    resident: null,
  },
  {
    id: '4',
    number: '201',
    floor: '2',
    type: '2 Bedroom',
    status: 'occupied',
    resident: {
      name: 'Robert Chen',
      email: 'robert.chen@example.com',
      phone: '(555) 345-6789',
      moveInDate: '05/10/2022',
    },
  },
  {
    id: '5',
    number: '202',
    floor: '2',
    type: '2 Bedroom',
    status: 'occupied',
    resident: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '(555) 456-7890',
      moveInDate: '06/20/2023',
    },
  },
  {
    id: '6',
    number: '203',
    floor: '2',
    type: '1 Bedroom',
    status: 'occupied',
    resident: {
      name: 'David Kim',
      email: 'david.kim@example.com',
      phone: '(555) 567-8901',
      moveInDate: '11/01/2022',
    },
  },
  {
    id: '7',
    number: '301',
    floor: '3',
    type: '3 Bedroom',
    status: 'occupied',
    resident: {
      name: 'Emily Wilson',
      email: 'emily.wilson@example.com',
      phone: '(555) 678-9012',
      moveInDate: '02/15/2023',
    },
  },
  {
    id: '8',
    number: '302',
    floor: '3',
    type: '2 Bedroom',
    status: 'vacant',
    resident: null,
  },
  {
    id: '9',
    number: '303',
    floor: '3',
    type: '1 Bedroom',
    status: 'occupied',
    resident: {
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '(555) 789-0123',
      moveInDate: '04/01/2023',
    },
  },
  {
    id: '10',
    number: '304',
    floor: '3',
    type: '2 Bedroom',
    status: 'occupied',
    resident: {
      name: 'Jessica Taylor',
      email: 'jessica.taylor@example.com',
      phone: '(555) 890-1234',
      moveInDate: '07/12/2022',
    },
  },
];

function UnitDetailModal({ visible, onClose, darkMode, unit }: { visible: boolean; onClose: () => void; darkMode: boolean; unit: any }) {
  if (!unit) return null;
  const resident = unit.resident || {};
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: darkMode ? '#222' : '#FFF', borderRadius: 18, width: '92%', maxHeight: '92%', padding: 0, overflow: 'hidden' }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: darkMode ? '#333' : '#F3F4F6', backgroundColor: darkMode ? '#222' : '#F9FAFB' }}>
            <TouchableOpacity onPress={onClose} style={{ marginRight: 12 }}>
              <ArrowLeft size={24} color={darkMode ? '#FFF' : '#1E88E5'} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 20, color: darkMode ? '#FFF' : '#1E88E5' }}>{unit.name}</Text>
              <Text style={{ fontFamily: 'Inter-Regular', fontSize: 14, color: darkMode ? '#BDBDBD' : '#6B7280' }}>{unit.type} • <Text style={{ color: '#4CAF50' }}>Occupied ✅</Text></Text>
            </View>
          </View>

          <ScrollView style={{ padding: 18 }} showsVerticalScrollIndicator={false}>
            {/* Resident Info */}
            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: darkMode ? '#FFF' : '#1E88E5', marginBottom: 8 }}>Resident Info</Text>
            <View style={{ backgroundColor: darkMode ? '#181818' : '#F3F4F6', borderRadius: 10, padding: 14, marginBottom: 18 }}>
              <Text style={{ fontFamily: 'Inter-Medium', fontSize: 15, color: darkMode ? '#FFF' : '#222' }}>{resident.name || 'John Doe'}</Text>
              <Text style={{ color: darkMode ? '#BDBDBD' : '#6B7280', marginTop: 2 }}>📞 {resident.phone || '(555) 123-4567'}</Text>
              <Text style={{ color: darkMode ? '#BDBDBD' : '#6B7280', marginTop: 2 }}>✉️ {resident.email || 'john.doe@example.com'}</Text>
              <Text style={{ color: darkMode ? '#BDBDBD' : '#6B7280', marginTop: 2 }}>Move-in: {resident.moveInDate || '01/15/2023'}</Text>
              <Text style={{ color: darkMode ? '#BDBDBD' : '#6B7280', marginTop: 2 }}>Lease: Jan 2023 - Dec 2024</Text>
            </View>

            {/* Rent Details */}
            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: darkMode ? '#FFF' : '#1E88E5', marginBottom: 8 }}>Rent Details</Text>
            <View style={{ backgroundColor: darkMode ? '#181818' : '#F3F4F6', borderRadius: 10, padding: 14, marginBottom: 18 }}>
              <Text style={{ color: darkMode ? '#FFF' : '#222', fontSize: 15 }}>₹20,000 <Text style={{ color: '#6B7280', fontSize: 13 }}>/ month</Text></Text>
              <Text style={{ color: darkMode ? '#BDBDBD' : '#6B7280', marginTop: 2 }}>Last Paid: 01 May 2024</Text>
              <Text style={{ color: darkMode ? '#BDBDBD' : '#6B7280', marginTop: 2 }}>Next Due: 01 June 2024</Text>
              <TouchableOpacity style={{ marginTop: 10, backgroundColor: '#1E88E5', borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}>
                <Text style={{ color: '#FFF', fontFamily: 'Inter-SemiBold', fontSize: 15 }}>View Payment History</Text>
              </TouchableOpacity>
            </View>

            {/* Maintenance */}
            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: darkMode ? '#FFF' : '#1E88E5', marginBottom: 8 }}>Maintenance</Text>
            <View style={{ backgroundColor: darkMode ? '#181818' : '#F3F4F6', borderRadius: 10, padding: 14, marginBottom: 18 }}>
              <Text style={{ color: '#E53935', fontFamily: 'Inter-Medium', fontSize: 15 }}>1 Active Issue: Leaking tap</Text>
              <TouchableOpacity style={{ marginTop: 8 }}>
                <Text style={{ color: '#1E88E5', fontSize: 14 }}>View all requests</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: 8, backgroundColor: '#4CAF50', borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}>
                <Text style={{ color: '#FFF', fontFamily: 'Inter-SemiBold', fontSize: 15 }}>+ Raise New Ticket</Text>
              </TouchableOpacity>
            </View>

            {/* Documents */}
            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: darkMode ? '#FFF' : '#1E88E5', marginBottom: 8 }}>Documents</Text>
            <View style={{ backgroundColor: darkMode ? '#181818' : '#F3F4F6', borderRadius: 10, padding: 14, marginBottom: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <FileText size={18} color="#1E88E5" style={{ marginRight: 8 }} />
                <Text style={{ color: darkMode ? '#FFF' : '#222' }}>Lease Agreement.pdf</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <FileCheck size={18} color="#1E88E5" style={{ marginRight: 8 }} />
                <Text style={{ color: darkMode ? '#FFF' : '#222' }}>Rent Receipts</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FileSignature size={18} color="#1E88E5" style={{ marginRight: 8 }} />
                <Text style={{ color: darkMode ? '#FFF' : '#222' }}>Resident ID</Text>
              </View>
            </View>

            {/* Utilities */}
            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: darkMode ? '#FFF' : '#1E88E5', marginBottom: 8 }}>Utilities</Text>
            <View style={{ backgroundColor: darkMode ? '#181818' : '#F3F4F6', borderRadius: 10, padding: 14, marginBottom: 18 }}>
              <Text style={{ color: darkMode ? '#FFF' : '#222' }}><Zap size={16} color="#FFC107" /> Electricity Meter: 12345678 (Avg: 250 kWh)</Text>
              <Text style={{ color: darkMode ? '#FFF' : '#222', marginTop: 4 }}><Droplet size={16} color="#1E88E5" /> Water Meter: 87654321 (Avg: 12 KL)</Text>
            </View>

            {/* Notes */}
            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: darkMode ? '#FFF' : '#1E88E5', marginBottom: 8 }}>Notes</Text>
            <View style={{ backgroundColor: darkMode ? '#181818' : '#F3F4F6', borderRadius: 10, padding: 14, marginBottom: 18 }}>
              <Text style={{ color: darkMode ? '#FFF' : '#222' }}>VIP tenant. Prefers email communication. No pets.</Text>
            </View>

            {/* Admin Actions */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, marginBottom: 8 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#1E88E5', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginRight: 8 }}>
                <Edit size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={{ color: '#FFF', fontFamily: 'Inter-SemiBold', fontSize: 15 }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#FFC107', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginRight: 8 }}>
                <UserCheck size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={{ color: '#FFF', fontFamily: 'Inter-SemiBold', fontSize: 15 }}>Change Status</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#E53935', borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}>
                <LogOut size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={{ color: '#FFF', fontFamily: 'Inter-SemiBold', fontSize: 15 }}>Vacate Unit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function DirectoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { userRole } = useAuth();
  const { darkMode } = useTheme();
  
  // Add Unit Modal State
  const [addUnitModal, setAddUnitModal] = useState(false);
  const [newUnit, setNewUnit] = useState({ number: '', floor: '', type: '1 Bedroom', status: 'vacant' });
  const [apartments, setApartments] = useState(apartmentsData);
  const unitTypes = ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom'];
  const statusTypes = ['vacant', 'occupied'];

  const fadeAnim = useState(new Animated.Value(0))[0];
  const [unitDetailModal, setUnitDetailModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const lastTapRef = useRef<number | null>(null);
  
  // Edit Unit Modal State
  const [editUnitModal, setEditUnitModal] = useState(false);
  const [editUnit, setEditUnit] = useState<any>(null);
  const [editResident, setEditResident] = useState({ name: '', email: '', phone: '', moveInDate: '' });
  
  const toggleFilters = () => {
    if (showFilters) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowFilters(false);
      });
    } else {
      setShowFilters(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handleAddUnit = () => {
    if (!newUnit.number || !newUnit.floor) return;
    setApartments(prev => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        number: newUnit.number,
        floor: newUnit.floor,
        type: newUnit.type,
        status: newUnit.status,
        resident: null,
      },
    ]);
    setAddUnitModal(false);
    setNewUnit({ number: '', floor: '', type: '1 Bedroom', status: 'vacant' });
  };
  
  const handleEditUnit = () => {
    if (!editUnit) return;
    setApartments(prev => prev.map(unit => {
      if (unit.id === editUnit.id) {
        if (editUnit.status === 'occupied') {
          return { ...unit, status: 'occupied', resident: { ...editResident } };
        } else {
          return { ...unit, status: 'vacant', resident: null };
        }
      }
      return unit;
    }));
    setEditUnitModal(false);
    setEditUnit(null);
    setEditResident({ name: '', email: '', phone: '', moveInDate: '' });
  };
  
  const filteredApartments = apartments
    .filter(apt => {
      // Apply search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        apt.number.toLowerCase().includes(searchLower) ||
        (apt.resident?.name.toLowerCase().includes(searchLower) || false);
      
      // Apply status filter
      const matchesStatus = 
        selectedFilter === 'all' ||
        (selectedFilter === 'occupied' && apt.status === 'occupied') ||
        (selectedFilter === 'vacant' && apt.status === 'vacant');
      
      // Apply floor filter
      const matchesFloor =
        selectedFloor === 'all' ||
        apt.floor === selectedFloor;
      
      return matchesSearch && matchesStatus && matchesFloor;
    })
    .sort((a, b) => {
      // Sort by floor, then by apartment number
      if (a.floor !== b.floor) {
        return parseInt(a.floor) - parseInt(b.floor);
      }
      return parseInt(a.number) - parseInt(b.number);
    });
  
  const toggleExpand = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };
  
  const handleUnitPress = (item: any) => {
    const now = Date.now();
    if (item.resident) {
      if (lastTapRef.current && now - lastTapRef.current < 300) {
        setSelectedUnit(item);
        setUnitDetailModal(true);
      }
      lastTapRef.current = now;
    }
  };
  
  const renderApartmentItem = ({ item }: { item: typeof apartmentsData[0] }) => {
    const isExpanded = expandedItem === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.apartmentCard, darkMode && styles.apartmentCardDark]}
        onPress={() => { toggleExpand(item.id); handleUnitPress(item); }}
      >
        <View style={styles.apartmentHeader}>
          <View style={styles.apartmentInfo}>
            <Text style={[styles.apartmentNumber, darkMode && styles.apartmentNumberDark]}>Unit {item.number}</Text>
            <Text style={[styles.apartmentType, darkMode && styles.apartmentTypeDark]}>{item.type}</Text>
          </View>
          <View style={styles.apartmentStatus}>
            {item.status === 'occupied' ? (
              <View style={[styles.statusBadge, darkMode && styles.statusBadgeDark]}>
                <CheckCircle2 size={16} color="#4CAF50" />
                <Text style={[styles.statusText, darkMode && styles.statusTextDark]}>Occupied</Text>
              </View>
            ) : (
              <View style={[styles.statusBadge, darkMode && styles.statusBadgeDark]}>
                <XCircle size={16} color="#E53935" />
                <Text style={[styles.statusText, darkMode && styles.statusTextDark]}>Vacant</Text>
              </View>
            )}
            <ChevronRight size={20} color="#9CA3AF" />
            {/* Edit button for admin only */}
            {userRole === 'admin' && (
              <TouchableOpacity style={[styles.editUnitBtn, darkMode && styles.editUnitBtnDark]} onPress={() => { setEditUnit(item); setEditUnitModal(true); }}>
                <Text style={[styles.editUnitBtnText, darkMode && styles.editUnitBtnTextDark]}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {isExpanded && (
          item.resident ? (
            <View style={styles.residentInfo}>
              <View style={styles.residentHeader}>
                <User size={20} color="#1E88E5" />
                <Text style={[styles.residentName, darkMode && styles.residentNameDark]}>{item.resident.name}</Text>
              </View>
              <View style={styles.residentDetails}>
                <View style={styles.residentDetail}>
                  <PhoneCall size={16} color="#6B7280" />
                  <Text style={[styles.residentDetailText, darkMode && styles.residentDetailTextDark]}>{item.resident.phone}</Text>
                </View>
                <View style={styles.residentDetail}>
                  <Mail size={16} color="#6B7280" />
                  <Text style={[styles.residentDetailText, darkMode && styles.residentDetailTextDark]}>{item.resident.email}</Text>
                </View>
                <View style={styles.residentDetail}>
                  <Home size={16} color="#6B7280" />
                  <Text style={[styles.residentDetailText, darkMode && styles.residentDetailTextDark]}>Moved in: {item.resident.moveInDate}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.residentInfo}>
              <Text style={{ color: darkMode ? '#FFF' : '#6B7280', fontStyle: 'italic', fontSize: 15 }}>This unit is currently vacant.</Text>
            </View>
          )
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={[styles.safeArea, darkMode && styles.safeAreaDark]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, darkMode && styles.headerTitleDark]}>HomeHarbor</Text>
          <TouchableOpacity style={[styles.filterButton, darkMode && styles.filterButtonDark]} onPress={toggleFilters}>
            <Filter size={24} color={darkMode ? '#FFF' : '#1E88E5'} />
          </TouchableOpacity>
        </View>
        {/* Add Unit Button for Admin Only */}
        {userRole === 'admin' && (
          <TouchableOpacity style={[styles.addUnitButton, darkMode && styles.addUnitButtonDark]} onPress={() => setAddUnitModal(true)}>
            <Text style={styles.addUnitButtonText}>+ Add Unit</Text>
          </TouchableOpacity>
        )}
        {/* Add Unit Modal */}
        <Modal visible={addUnitModal} transparent animationType="slide" onRequestClose={() => setAddUnitModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.addUnitModal, darkMode && styles.addUnitModalDark]}>
              <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>Add New Unit</Text>
              <TextInput
                style={[styles.input, darkMode && styles.inputDark]}
                placeholder="Unit Number"
                value={newUnit.number}
                onChangeText={val => setNewUnit(u => ({ ...u, number: val }))}
                placeholderTextColor={darkMode ? '#888' : '#999'}
              />
              <TextInput
                style={[styles.input, darkMode && styles.inputDark]}
                placeholder="Floor"
                value={newUnit.floor}
                onChangeText={val => setNewUnit(u => ({ ...u, floor: val }))}
                placeholderTextColor={darkMode ? '#888' : '#999'}
              />
              <Text style={[styles.inputLabel, darkMode && styles.inputLabelDark]}>Type</Text>
              <View style={styles.dropdownRow}>
                {unitTypes.map(type => (
                  <TouchableOpacity key={type} style={[styles.dropdownBtn, newUnit.type === type && styles.dropdownBtnActive]} onPress={() => setNewUnit(u => ({ ...u, type }))}>
                    <Text style={[styles.dropdownBtnText, newUnit.type === type && styles.dropdownBtnTextActive]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.inputLabel, darkMode && styles.inputLabelDark]}>Status</Text>
              <View style={styles.dropdownRow}>
                {statusTypes.map(status => (
                  <TouchableOpacity key={status} style={[styles.dropdownBtn, newUnit.status === status && styles.dropdownBtnActive]} onPress={() => setNewUnit(u => ({ ...u, status }))}>
                    <Text style={[styles.dropdownBtnText, newUnit.status === status && styles.dropdownBtnTextActive]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ flexDirection: 'row', marginTop: 16 }}>
                <TouchableOpacity style={[styles.addUnitModalBtn, { backgroundColor: '#E53935', marginRight: 8 }]} onPress={() => setAddUnitModal(false)}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.addUnitModalBtn, { backgroundColor: '#1E88E5' }]} onPress={handleAddUnit}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
        <View style={[styles.searchContainer, darkMode && styles.searchContainerDark]}>
          <Search size={20} color={darkMode ? '#FFF' : '#6B7280'} />
          <TextInput
            style={[styles.searchInput, darkMode && styles.searchInputDark]}
            placeholder="Search by unit or resident name"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={darkMode ? '#888' : '#6B7280'}
          />
        </View>
        
        {showFilters && (
          <Animated.View style={[styles.filtersContainer, darkMode && styles.filtersContainerDark, { opacity: fadeAnim }]}>
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, darkMode && styles.filterLabelDark]}>Status</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedFilter === 'all' && styles.filterOptionSelected,
                    darkMode && styles.filterOptionDark,
                  ]}
                  onPress={() => setSelectedFilter('all')}
                >
                  <Text style={[styles.filterOptionText, darkMode && styles.filterOptionTextDark]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedFilter === 'occupied' && styles.filterOptionSelected,
                    darkMode && styles.filterOptionDark,
                  ]}
                  onPress={() => setSelectedFilter('occupied')}
                >
                  <Text style={[styles.filterOptionText, darkMode && styles.filterOptionTextDark]}>Occupied</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedFilter === 'vacant' && styles.filterOptionSelected,
                    darkMode && styles.filterOptionDark,
                  ]}
                  onPress={() => setSelectedFilter('vacant')}
                >
                  <Text style={[styles.filterOptionText, darkMode && styles.filterOptionTextDark]}>Vacant</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, darkMode && styles.filterLabelDark]}>Floor</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedFloor === 'all' && styles.filterOptionSelected,
                    darkMode && styles.filterOptionDark,
                  ]}
                  onPress={() => setSelectedFloor('all')}
                >
                  <Text style={[styles.filterOptionText, darkMode && styles.filterOptionTextDark]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedFloor === '1' && styles.filterOptionSelected,
                    darkMode && styles.filterOptionDark,
                  ]}
                  onPress={() => setSelectedFloor('1')}
                >
                  <Text style={[styles.filterOptionText, darkMode && styles.filterOptionTextDark]}>1st</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedFloor === '2' && styles.filterOptionSelected,
                    darkMode && styles.filterOptionDark,
                  ]}
                  onPress={() => setSelectedFloor('2')}
                >
                  <Text style={[styles.filterOptionText, darkMode && styles.filterOptionTextDark]}>2nd</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedFloor === '3' && styles.filterOptionSelected,
                    darkMode && styles.filterOptionDark,
                  ]}
                  onPress={() => setSelectedFloor('3')}
                >
                  <Text style={[styles.filterOptionText, darkMode && styles.filterOptionTextDark]}>3rd</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
        
        <FlatList
          data={filteredApartments}
          renderItem={renderApartmentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <UnitDetailModal
        visible={unitDetailModal}
        onClose={() => setUnitDetailModal(false)}
        darkMode={darkMode}
        unit={selectedUnit}
      />
      {/* Edit Unit Modal */}
      <Modal visible={editUnitModal} transparent animationType="slide" onRequestClose={() => setEditUnitModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.addUnitModal, darkMode && styles.addUnitModalDark]}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>Edit Unit Status</Text>
            <Text style={[styles.inputLabel, darkMode && styles.inputLabelDark]}>Status</Text>
            <View style={styles.dropdownRow}>
              {['vacant', 'occupied'].map(status => (
                <TouchableOpacity key={status} style={[styles.dropdownBtn, editUnit?.status === status && styles.dropdownBtnActive]} onPress={() => {
                  setEditUnit((u: any) => ({ ...u, status }));
                  if (status === 'occupied' && (!editUnit.resident || editUnit.status === 'vacant')) {
                    setEditResident({ name: '', email: '', phone: '', moveInDate: '' });
                  }
                }}>
                  <Text style={[styles.dropdownBtnText, editUnit?.status === status && styles.dropdownBtnTextActive]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Show tenant info fields if switching to occupied */}
            {editUnit?.status === 'occupied' && (
              <View>
                <Text style={[styles.inputLabel, darkMode && styles.inputLabelDark]}>Tenant Name</Text>
                <TextInput
                  style={[styles.input, darkMode && styles.inputDark]}
                  placeholder="Name"
                  value={editResident.name}
                  onChangeText={val => setEditResident(r => ({ ...r, name: val }))}
                  placeholderTextColor={darkMode ? '#888' : '#999'}
                />
                <Text style={[styles.inputLabel, darkMode && styles.inputLabelDark]}>Email</Text>
                <TextInput
                  style={[styles.input, darkMode && styles.inputDark]}
                  placeholder="Email"
                  value={editResident.email}
                  onChangeText={val => setEditResident(r => ({ ...r, email: val }))}
                  placeholderTextColor={darkMode ? '#888' : '#999'}
                />
                <Text style={[styles.inputLabel, darkMode && styles.inputLabelDark]}>Phone</Text>
                <TextInput
                  style={[styles.input, darkMode && styles.inputDark]}
                  placeholder="Phone"
                  value={editResident.phone}
                  onChangeText={val => setEditResident(r => ({ ...r, phone: val }))}
                  placeholderTextColor={darkMode ? '#888' : '#999'}
                />
                <Text style={[styles.inputLabel, darkMode && styles.inputLabelDark]}>Move-in Date</Text>
                <TextInput
                  style={[styles.input, darkMode && styles.inputDark]}
                  placeholder="YYYY-MM-DD"
                  value={editResident.moveInDate}
                  onChangeText={val => setEditResident(r => ({ ...r, moveInDate: val }))}
                  placeholderTextColor={darkMode ? '#888' : '#999'}
                />
              </View>
            )}
            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <TouchableOpacity style={[styles.addUnitModalBtn, { backgroundColor: '#E53935', marginRight: 8 }]} onPress={() => setEditUnitModal(false)}>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.addUnitModalBtn, { backgroundColor: '#1E88E5' }]} onPress={handleEditUnit}>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  safeAreaDark: {
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#1E88E5',
  },
  headerTitleDark: {
    color: '#FFFFFF',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonDark: {
    backgroundColor: '#181818',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainerDark: {
    backgroundColor: '#181818',
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  searchInputDark: {
    color: '#FFFFFF',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filtersContainerDark: {
    backgroundColor: '#181818',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  filterLabelDark: {
    color: '#FFFFFF',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionDark: {
    backgroundColor: '#333',
  },
  filterOptionSelected: {
    backgroundColor: '#1E88E5',
  },
  filterOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333',
  },
  filterOptionTextDark: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 16,
  },
  apartmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  apartmentCardDark: {
    backgroundColor: '#333',
  },
  apartmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apartmentInfo: {
    flex: 1,
  },
  apartmentNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E88E5',
  },
  apartmentNumberDark: {
    color: '#FFFFFF',
  },
  apartmentType: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  apartmentTypeDark: {
    color: '#FFFFFF',
  },
  apartmentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  statusBadgeDark: {
    backgroundColor: '#181818',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#333',
    marginLeft: 4,
  },
  statusTextDark: {
    color: '#FFFFFF',
  },
  residentInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  residentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  residentName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E88E5',
    marginLeft: 8,
  },
  residentNameDark: {
    color: '#FFFFFF',
  },
  residentDetails: {
    marginLeft: 28,
  },
  residentDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  residentDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  residentDetailTextDark: {
    color: '#FFFFFF',
  },
  addUnitButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  addUnitButtonDark: {
    backgroundColor: '#333',
  },
  addUnitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addUnitModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    width: '92%',
    maxHeight: '92%',
    padding: 16,
  },
  addUnitModalDark: {
    backgroundColor: '#333',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1E88E5',
    marginBottom: 16,
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  inputDark: {
    backgroundColor: '#333',
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  inputLabelDark: {
    color: '#FFFFFF',
  },
  dropdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dropdownBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  dropdownBtnActive: {
    backgroundColor: '#1E88E5',
  },
  dropdownBtnText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333',
  },
  dropdownBtnTextActive: {
    color: '#FFFFFF',
  },
  addUnitModalBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editUnitBtn: {
    marginLeft: 8,
    backgroundColor: '#E8F4FD',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editUnitBtnDark: {
    backgroundColor: '#181818',
  },
  editUnitBtnText: {
    color: '#1E88E5',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
  },
  editUnitBtnTextDark: {
    color: '#FFF',
  },
});