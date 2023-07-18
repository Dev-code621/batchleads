/* eslint-disable no-unused-vars */
import React from 'react';

export default ({
  title,
  options,
  selectedPlanIndex,
  onChangeAddon,
  addOns,
  addOnIndex,
}) => (
  <div className="plan-details-item">
    <div className="plan-details-item-description">
      <div
        className={
            `addon-checkbox
            ${addOns[addOnIndex] || selectedPlanIndex === 2 ? ' checked' : ''}
            ${selectedPlanIndex === 2 ? ' disabled' : ''}
            `
          }
        onClick={selectedPlanIndex < 2 ? onChangeAddon : undefined}
      >
        {title}
        <span>{options[selectedPlanIndex].label}</span>
      </div>
    </div>
    <div className="plan-details-item-detail">
      {
          options.map((item, index) => {
            return (
              <div className="plan-details-item-detail-cell item">
                <div
                  className={
                    `addon-item
                      ${addOns[addOnIndex] && index === selectedPlanIndex && selectedPlanIndex < 2 ? ' active' : ''}
                    `
                  }
                  onClick={
                    selectedPlanIndex < 2 && index === selectedPlanIndex
                      ? onChangeAddon : undefined
                  }
                >
                  {item.label}
                </div>
              </div>
            );
          })
        }
    </div>
  </div>
);
