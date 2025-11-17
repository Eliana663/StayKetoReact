import styles from '@/components/Food/FoodCard/FoodCard.module.css';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { FoodResumeModal }from '@/components/Food';

export default function FoodCard({ item, onAdd }) {
  const [amount, setAmount] = useState(100); // 100 g default
  const factor = amount / (item.quantity || 100);
  const [showModal, setShowModal] = useState(false); // to show, hide Foodresumemodal
  const baseUrl = "http://localhost:8081/public-images";
 const rawPath = item.image_url || 'default.jpg';
  const imagePath = rawPath.startsWith('/images/')
    ? rawPath.replace('/images/', '')
    : rawPath;

  const fullImageUrl = imagePath.startsWith('http')
    ? imagePath
  : `${baseUrl}/${imagePath}`;

  return (
    <>
    <div
      className={styles.card}
      onClick={() => setShowModal(true)} // This click opens foodresumeModel
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 15px 3px rgba(7, 101, 64, 0.445)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 6px rgba(0,0,0,0.05)'}
    >
      <div className="row g-0 align-items-center">
        <div className={`${styles.imgContainer} col-md-3`}>
          <img
            src={fullImageUrl}
            alt={item.name}
            className={styles.image}
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'http://localhost:8081/images/default.jpg';
            }}
          />
        </div>

        <div className={`${styles.cardBody} col-md-8`}>
          <h5 className={styles.title}>{item.name}</h5>
          <p className={styles.textMuted}>{item.commonName}</p>
          <div className={styles.ketoLabel}>
            <span className={`${styles.badge} ${item.isKeto ? styles.keto : styles['no-keto']}`}>
              {item.isKeto ? 'Keto' : 'No keto'}
            </span> — {item.unit || '100'} ({item.unitType || 'g'})
          </div>

          <div className={styles.nutrientsRow + " row small"}>
            <div className="col"><strong>Calorías:</strong> {(item.calories * factor).toFixed(1)} kcal</div>
            <div className="col"><strong>Carbohidratos netos:</strong> {(item.carbohydrates * factor).toFixed(1)} g</div>
            <div className="col"><strong>Grasas:</strong> {(item.fat * factor).toFixed(1)} g</div>
            <div className="col"><strong>Proteínas:</strong> {(item.proteins * factor).toFixed(1)} g</div>
          </div>

          
        </div>
        {onAdd && (
          <div className={`${styles.buttonContainer} col-md-1 text-center`}>
            <button
              className="btn btn-outline-success"
              title="Agregar"
              onClick={(e) => {
                e.stopPropagation();
                onAdd(item, amount);
              }}
            >
              <PlusCircle />
            </button>
          </div>
        )}
      </div>
    </div>
      <FoodResumeModal
          show={showModal}
          onClose={() => setShowModal(false)}
          item={item}
          amount={amount}      
          setAmount={setAmount}
          onAdd={onAdd}
        />

    
          
        </>
      );
    }