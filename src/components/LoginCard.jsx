import React from 'react';

const LoginCard = ({ title, children }) => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
    padding: '1rem',
  },
  card: {
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 60px -10px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
  },
  title: {
    marginBottom: '24px',
    textAlign: 'center',
    fontSize: '1.75rem',
    fontWeight: '600',
  },
};

export default LoginCard;