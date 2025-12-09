// Detecção de plataforma e adaptação
const Platform = {
  isElectron: () => typeof window !== 'undefined' && window.isElectron,
  isCapacitor: () => typeof window !== 'undefined' && window.capacitor,
  isMobile: () => {
    if (Platform.isCapacitor()) return true;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  isDesktop: () => Platform.isElectron() || !Platform.isMobile(),
  getName: () => {
    if (Platform.isElectron()) return 'electron';
    if (Platform.isCapacitor()) return 'capacitor';
    if (Platform.isMobile()) return 'web-mobile';
    return 'web-desktop';
  },
};

// Sistema de armazenamento adaptativo
class Storage {
  constructor() {
    this.platform = Platform.getName();
  }

  getItem(key) {
    if (this.platform === 'electron') {
      return window.electron.store.get(key) || null;
    } else if (this.platform === 'capacitor') {
      // Usar Capacitor Preferences
      return localStorage.getItem(key);
    } else {
      return localStorage.getItem(key);
    }
  }

  setItem(key, value) {
    const strValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (this.platform === 'electron') {
      window.electron.store.set(key, strValue);
    } else {
      localStorage.setItem(key, strValue);
    }
  }

  removeItem(key) {
    if (this.platform === 'electron') {
      window.electron.store.set(key, null);
    } else {
      localStorage.removeItem(key);
    }
  }

  clear() {
    if (this.platform === 'electron') {
      window.electron.store.clear();
    } else {
      localStorage.clear();
    }
  }

  // Método para sincronizar entre dispositivos (futuro)
  async sync() {
    if (this.platform === 'capacitor') {
      // Aqui você pode implementar sincronização com backend
      console.log('Sincronizando dados...');
    }
  }
}

const adaptiveStorage = new Storage();

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.Platform = Platform;
  window.adaptiveStorage = adaptiveStorage;
}
