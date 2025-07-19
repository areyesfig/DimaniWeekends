import { WebpayConfig, WebpayCallbackParams, PaymentResult } from '../types';

// Configuración de Webpay Sandbox
const WEBPAY_CONFIG = {
  commerceCode: '597055555532', // Código de comercio de prueba
  apiKey: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
  returnUrl: 'dimaniweekends://payment-result',
  sessionId: '',
  amount: 0,
  buyOrder: ''
};

// Generar configuración de Webpay
export const generateWebpayConfig = (
  amount: number, 
  buyOrder: string
): WebpayConfig => {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    ...WEBPAY_CONFIG,
    sessionId,
    amount,
    buyOrder
  };
};

// Crear URL de Webpay
export const createWebpayUrl = (config: WebpayConfig): string => {
  const baseUrl = 'https://webpay3gint.transbank.cl/webpayserver/initTransaction';
  
  const params = new URLSearchParams({
    commerce_code: config.commerceCode,
    buy_order: config.buyOrder,
    session_id: config.sessionId,
    amount: config.amount.toString(),
    return_url: config.returnUrl
  });
  
  return `${baseUrl}?${params.toString()}`;
};

// Procesar callback de Webpay
export const processWebpayCallback = async (
  params: WebpayCallbackParams
): Promise<PaymentResult> => {
  try {
    // En un entorno real, aquí se validaría la respuesta con Transbank
    const { token_ws, tbk_orden_compra, tbk_respuesta } = params;
    
    if (tbk_respuesta === '0') {
      // Pago exitoso
      return {
        success: true,
        orderId: tbk_orden_compra,
        transactionId: token_ws
      };
    } else {
      // Pago fallido
      return {
        success: false,
        orderId: tbk_orden_compra,
        error: 'Pago rechazado por Transbank'
      };
    }
  } catch (error) {
    console.error('Error processing Webpay callback:', error);
    return {
      success: false,
      orderId: '',
      error: 'Error procesando el pago'
    };
  }
};

// Validar respuesta de Webpay
export const validateWebpayResponse = (params: any): boolean => {
  const requiredParams = ['token_ws', 'tbk_orden_compra', 'tbk_respuesta'];
  
  return requiredParams.every(param => params[param] !== undefined);
};

// Obtener mensaje de error de Webpay
export const getWebpayErrorMessage = (responseCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    '-1': 'Rechazo de transacción',
    '-2': 'Rechazo de transacción',
    '-3': 'Error en transacción',
    '-4': 'Rechazo de transacción',
    '-5': 'Rechazo por error de tasa',
    '-6': 'Excede cuota máxima',
    '-7': 'Excede límite diario',
    '-8': 'Rubro no autorizado',
    '-97': 'Límites OnePay, máximo diario',
    '-98': 'Límites OnePay, máximo mensual',
    '-99': 'Límites OnePay, máximo diario'
  };
  
  return errorMessages[responseCode] || 'Error desconocido en el pago';
}; 