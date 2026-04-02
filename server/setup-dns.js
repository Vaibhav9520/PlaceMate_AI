import dns from 'dns';

// Configure DNS servers for better MongoDB Atlas connectivity
console.log('🔧 Configuring DNS for MongoDB Atlas...');
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('✅ DNS configured with Google servers:', dns.getServers());

export default function setupDNS() {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}