import { OrderWindow } from '../types';

// Validar si una fecha está dentro de la ventana permitida
export const validateDeliveryDateTime = (
  dateTime: Date,
  orderWindow: OrderWindow
): { isValid: boolean; message?: string } => {
  const now = new Date();
  const deliveryDate = new Date(dateTime);
  
  // Validar que no sea en el pasado
  if (deliveryDate <= now) {
    return {
      isValid: false,
      message: 'La fecha de entrega no puede ser en el pasado'
    };
  }
  
  // Validar día de la semana
  const dayOfWeek = deliveryDate.getDay();
  if (!orderWindow.allowedDays.includes(dayOfWeek)) {
    return {
      isValid: false,
      message: 'Solo se permiten pedidos para sábados y domingos'
    };
  }
  
  // Validar horario
  const deliveryTime = deliveryDate.toTimeString().slice(0, 5); // HH:MM
  const startTime = orderWindow.startTime;
  const endTime = orderWindow.endTime;
  
  if (deliveryTime < startTime || deliveryTime > endTime) {
    return {
      isValid: false,
      message: `El horario de entrega debe ser entre ${startTime} y ${endTime}`
    };
  }
  
  // Si es hoy, validar que esté dentro de la ventana permitida
  const isToday = deliveryDate.toDateString() === now.toDateString();
  if (isToday) {
    const currentTime = now.toTimeString().slice(0, 5);
    if (currentTime >= endTime) {
      return {
        isValid: false,
        message: 'El horario de pedidos para hoy ya ha terminado'
      };
    }
  }
  
  return { isValid: true };
};

// Generar fechas disponibles para el próximo fin de semana
export const generateAvailableDates = (orderWindow: OrderWindow): Date[] => {
  const availableDates: Date[] = [];
  const now = new Date();
  
  // Buscar próximos sábados y domingos
  for (let i = 0; i < 4; i++) { // Próximas 4 semanas
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    
    const dayOfWeek = date.getDay();
    if (orderWindow.allowedDays.includes(dayOfWeek)) {
      // Generar horarios disponibles para este día
      const [startHour, startMinute] = orderWindow.startTime.split(':').map(Number);
      const [endHour, endMinute] = orderWindow.endTime.split(':').map(Number);
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) { // Intervalos de 30 minutos
          const deliveryDate = new Date(date);
          deliveryDate.setHours(hour, minute, 0, 0);
          
          // Solo incluir si es en el futuro
          if (deliveryDate > now) {
            availableDates.push(deliveryDate);
          }
        }
      }
    }
  }
  
  return availableDates.sort((a, b) => a.getTime() - b.getTime());
};

// Formatear fecha para mostrar
export const formatDeliveryDate = (date: Date): string => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const time = date.toTimeString().slice(0, 5);
  
  return `${dayName} ${day} de ${month} ${year} a las ${time}`;
};

// Obtener el próximo horario disponible
export const getNextAvailableTime = (orderWindow: OrderWindow): Date => {
  const now = new Date();
  const availableDates = generateAvailableDates(orderWindow);
  
  if (availableDates.length > 0) {
    return availableDates[0];
  }
  
  // Si no hay fechas disponibles, retornar el próximo sábado
  const nextSaturday = new Date(now);
  const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
  nextSaturday.setDate(now.getDate() + daysUntilSaturday);
  nextSaturday.setHours(10, 0, 0, 0); // 10:00 AM
  
  return nextSaturday;
};

// Validar si hay tiempo suficiente para preparar el pedido
export const validatePreparationTime = (deliveryDateTime: Date): boolean => {
  const now = new Date();
  const timeDiff = deliveryDateTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  // Mínimo 2 horas de anticipación
  return hoursDiff >= 2;
}; 