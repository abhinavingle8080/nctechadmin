import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import your slices or reducers
import roleAccessReducer from './slices/roleaccess';

// ----------------------------------------------------------------------

// Configuration for root level persistence
const rootPersistConfig = {
  key: 'root', // Storage key
  storage, // Storage method (e.g., localStorage)
  keyPrefix: 'redux-', // Prefix for storage keys
  whitelist: [], // List of reducers to persist
};

// Example configuration for product persistence
const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'], // Example: persist sortBy and checkout state
};

// Configuration for roleaccess persistence
const roleAccessPersistConfig = {
  key: 'roleaccess',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['rolepermissions', 'rolemodules'], // Example: persist rolepermissions and rolemodules
};

// Combine your reducers into root reducer
const rootReducer = combineReducers({
  roleaccess: persistReducer(roleAccessPersistConfig, roleAccessReducer), // Example: persist roleaccess slice
  // Add more reducers as your app grows
});

// Export the combined root reducer and the root persist configuration
export { rootReducer, rootPersistConfig };
