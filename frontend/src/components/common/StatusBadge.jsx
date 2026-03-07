
const StatusBadge = ({ status }) => {
  const styles = {
    pending: { backgroundColor: '#fef3c7', color: '#d97706' },
    approved: { backgroundColor: '#d1fae5', color: '#059669' },
    rejected: { backgroundColor: '#fee2e2', color: '#dc2626' },
    default: { backgroundColor: '#f3f4f6', color: '#4b5563' }
  };

  const currentStyle = styles[status?.toLowerCase()] || styles.default;

  return (
    <span style={{
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'capitalize',
      ...currentStyle
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;
