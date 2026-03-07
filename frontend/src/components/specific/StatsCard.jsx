
const StatsCard = ({ title, value, icon, color = 'blue' }) => {
  const colorMap = {
    blue: { bg: '#eff6ff', text: '#2563eb' },
    green: { bg: '#ecfdf5', text: '#059669' },
    yellow: { bg: '#fffbeb', text: '#d97706' },
    purple: { bg: '#f5f3ff', text: '#7c3aed' }
  };

  const theme = colorMap[color] || colorMap.blue;

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        backgroundColor: theme.bg,
        color: theme.text,
        padding: '0.75rem',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
