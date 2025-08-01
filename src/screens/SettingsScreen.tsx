import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const SettingsScreen: React.FC = () => {
  const { user, forceLogout } = useAuth();

  const handleForceLogout = () => {
    Alert.alert(
      'Forzar Logout',
      '¿Estás seguro de que quieres cerrar sesión y limpiar todos los datos locales?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            try {
              await forceLogout();
              Alert.alert('Éxito', 'Sesión cerrada y datos locales limpiados');
            } catch (error) {
              Alert.alert('Error', 'No se pudo limpiar la sesión');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Usuario</Text>
        <Text style={styles.userInfo}>Email: {user?.email}</Text>
        <Text style={styles.userInfo}>ID: {user?.id}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones</Text>
        <TouchableOpacity style={styles.dangerButton} onPress={handleForceLogout}>
          <Text style={styles.dangerButtonText}>Forzar Logout y Limpiar Datos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen; 