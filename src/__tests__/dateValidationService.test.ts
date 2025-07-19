import { validateDeliveryDateTime, generateAvailableDates, formatDeliveryDate } from '../services/dateValidationService';
import { OrderWindow } from '../types';

describe('dateValidationService', () => {
  const mockOrderWindow: OrderWindow = {
    startTime: '10:00',
    endTime: '14:00',
    allowedDays: [6, 0], // Sábado y domingo
    reservationTtlMinutes: 15
  };

  describe('validateDeliveryDateTime', () => {
    it('should validate a correct delivery date and time', () => {
      const deliveryDate = new Date('2024-01-06T11:00:00'); // Sábado 11:00
      const result = validateDeliveryDateTime(deliveryDate, mockOrderWindow);
      
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should reject delivery on weekdays', () => {
      const deliveryDate = new Date('2024-01-08T11:00:00'); // Lunes 11:00
      const result = validateDeliveryDateTime(deliveryDate, mockOrderWindow);
      
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Solo se permiten pedidos para sábados y domingos');
    });

    it('should reject delivery outside allowed hours', () => {
      const deliveryDate = new Date('2024-01-06T15:00:00'); // Sábado 15:00
      const result = validateDeliveryDateTime(deliveryDate, mockOrderWindow);
      
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('El horario de entrega debe ser entre 10:00 y 14:00');
    });

    it('should reject delivery in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      pastDate.setHours(11, 0, 0, 0);
      
      const result = validateDeliveryDateTime(pastDate, mockOrderWindow);
      
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('La fecha de entrega no puede ser en el pasado');
    });
  });

  describe('generateAvailableDates', () => {
    it('should generate available dates for weekends', () => {
      const availableDates = generateAvailableDates(mockOrderWindow);
      
      expect(availableDates.length).toBeGreaterThan(0);
      
      // Verificar que todas las fechas son sábados o domingos
      availableDates.forEach(date => {
        const dayOfWeek = date.getDay();
        expect([0, 6]).toContain(dayOfWeek);
      });
      
      // Verificar que todas las fechas están en el futuro
      const now = new Date();
      availableDates.forEach(date => {
        expect(date.getTime()).toBeGreaterThan(now.getTime());
      });
    });
  });

  describe('formatDeliveryDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-06T11:00:00'); // Sábado 6 de enero
      const formatted = formatDeliveryDate(date);
      
      expect(formatted).toContain('Sábado');
      expect(formatted).toContain('6');
      expect(formatted).toContain('Enero');
      expect(formatted).toContain('2024');
      expect(formatted).toContain('11:00');
    });
  });
}); 