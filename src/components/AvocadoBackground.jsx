import aguacateSonriente from '../assets/aguacateSonriente.jpg';

export default function AvocadoBackground({ children }) {
  const style = {
    background: `
      linear-gradient(rgba(208, 232, 201, 0.7), rgba(208, 232, 201, 0.7)),
      url(${aguacateSonriente})
    `,
    backgroundRepeat: 'repeat',
    backgroundSize: '250px 250px',
    minHeight: '100vh',
    width: '100%',
  };

  return (
    <div style={style}>
        <div
            style={{
            backgroundColor: 'white',
            margin: '1px auto',
            padding: '20px',
            maxWidth: '700px',  
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            width: '100%',    
            boxSizing: 'border-box'  
            }}
     >
        {children}
      </div>
    </div>
  );
}