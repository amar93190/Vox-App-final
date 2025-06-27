import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';

interface SchoolSelectProps {
  value: string;
  onValueChange: (school: string) => void;
  schools: string[];
}

export default function SchoolSelect({ value, onValueChange, schools }: SchoolSelectProps) {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={{ marginBottom: 18 }}>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: '#E0E0E0',
          borderRadius: 12,
          paddingVertical: 14,
          paddingHorizontal: 18,
          backgroundColor: '#FFF',
        }}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={{ color: '#222', fontSize: 16 }}>{value || 'Sélectionner une école'}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 18, width: '85%', maxHeight: 420 }}>
            <FlatList
              data={schools}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}
                  onPress={() => {
                    onValueChange(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={{ color: '#222', fontSize: 16 }}>{item}</Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={<View style={{ height: 8 }} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
} 