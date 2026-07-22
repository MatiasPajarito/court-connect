import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tcyrdvzqpztglanuykej.supabase.co';
// IMPORTANTE: Pega aquí dentro de las comillas tu llave Legacy que empieza por eyJ...
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_dqhCfEnUVXmUnCMo6L9hzg_Pvl3b4fB';

// Protección SSR para que Node.js 20 no colapse al abrir la página
let wsTransport = undefined;
if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line no-eval
    wsTransport = eval('require')('ws');
  } catch {
    // noop
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: wsTransport,
  },
});