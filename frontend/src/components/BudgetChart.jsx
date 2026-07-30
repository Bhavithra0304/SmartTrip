import React from 'react';
import { PieChart, TrendingDown } from 'lucide-react';
import './BudgetChart.css';

const categoryColors = [
  '#4A90E2', // Hotels
  '#7ED957', // Food
  '#F59E0B', // Transport
  '#8B5CF6', // Activities
  '#EC4899'  // Shopping
];

const BudgetChart = ({ budgetBreakdown }) => {
  if (!budgetBreakdown) return null;

  const total_budget = budgetBreakdown.total_budget || budgetBreakdown.converted_total_budget || budgetBreakdown.total_budget_usd || 0;
  const currency = budgetBreakdown.currency || 'USD';
  
  const categoriesList = budgetBreakdown.categories || budgetBreakdown.budget_breakdown || [
    { category: "Hotels & Stay", percentage: 35, allocated: total_budget * 0.35 },
    { category: "Food & Dining", percentage: 25, allocated: total_budget * 0.25 },
    { category: "Transport & Transit", percentage: 15, allocated: total_budget * 0.15 },
    { category: "Activities & Tickets", percentage: 15, allocated: total_budget * 0.15 },
    { category: "Shopping & Emergency", percentage: 10, allocated: total_budget * 0.10 }
  ];

  const savingsList = budgetBreakdown.cost_saving_recommendations || budgetBreakdown.saving_recommendations || [];

  return (
    <div className="budget-chart-card card">
      <div className="budget-header">
        <div className="header-title">
          <PieChart size={22} className="budget-icon" />
          <div>
            <h3>Budget Optimization Breakdown</h3>
            <span className="subtitle">5 Category Allocation Report</span>
          </div>
        </div>
        <div className="total-badge">
          <span>{currency} ${typeof total_budget === 'number' ? total_budget.toLocaleString() : total_budget}</span>
        </div>
      </div>

      {/* Visual Bar Stack */}
      <div className="budget-bar-stack">
        {categoriesList.map((cat, idx) => {
          const pct = cat.percentage || cat.percent || 20;
          const amt = cat.allocated || cat.converted || cat.usd || 0;
          return (
            <div 
              key={idx}
              className="bar-segment"
              style={{
                width: `${pct}%`,
                backgroundColor: categoryColors[idx % categoryColors.length]
              }}
              title={`${cat.category}: ${currency} $${amt} (${pct}%)`}
            />
          );
        })}
      </div>

      {/* Categories Legend Grid */}
      <div className="categories-grid">
        {categoriesList.map((cat, idx) => {
          const pct = cat.percentage || cat.percent || 20;
          const amt = cat.allocated || cat.converted || cat.usd || 0;
          return (
            <div key={idx} className="category-item">
              <div className="cat-header">
                <span className="dot" style={{ backgroundColor: categoryColors[idx % categoryColors.length] }}></span>
                <span className="cat-name">{cat.category}</span>
              </div>
              <div className="cat-val">
                <strong>${typeof amt === 'number' ? amt.toLocaleString() : amt}</strong>
                <span className="percent">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {savingsList.length > 0 && (
        <div className="savings-section">
          <h4><TrendingDown size={16} /> Cost-Saving Alternatives</h4>
          <ul>
            {savingsList.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BudgetChart;
