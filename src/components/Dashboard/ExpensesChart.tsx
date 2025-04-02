import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Search } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Sample data - in a real app, this would come from your backend
const monthlyData = {
  'Jan 2024': { 
    'Pearson Hardman': { Partner: 2000, Associate: 1500, Paralegal: 800, Other: 300 },
    'Zane & Associates': { Partner: 1800, Associate: 1300, Paralegal: 600, Other: 200 },
    'Smith & Partners': { Partner: 2200, Associate: 1600, Paralegal: 700, Other: 250 }
  },
  'Feb 2024': {
    'Pearson Hardman': { Partner: 1800, Associate: 1600, Paralegal: 900, Other: 400 },
    'Zane & Associates': { Partner: 1900, Associate: 1400, Paralegal: 700, Other: 300 },
    'Smith & Partners': { Partner: 2100, Associate: 1500, Paralegal: 800, Other: 350 }
  },
  'Mar 2024': {
    'Pearson Hardman': { Partner: 2200, Associate: 1400, Paralegal: 750, Other: 350 },
    'Zane & Associates': { Partner: 2000, Associate: 1600, Paralegal: 800, Other: 400 },
    'Smith & Partners': { Partner: 1900, Associate: 1700, Paralegal: 850, Other: 300 }
  }
};

const lawFirms = [
  'Pearson Hardman',
  'Zane & Associates',
  'Smith & Partners'
];

const serviceTypes = ['Partner', 'Associate', 'Paralegal', 'Other'];

const ExpensesChart: React.FC = () => {
  const [selectedMonths, setSelectedMonths] = useState<string[]>(Object.keys(monthlyData));
  const [selectedServices, setSelectedServices] = useState<string[]>(serviceTypes);
  const [selectedLawFirm, setSelectedLawFirm] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Expenses by Law Firm and Service Provider',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label;
            const value = context.parsed.y;
            return `${label}: $${value.toLocaleString()}`;
          }
        }
      },
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toLocaleString()}`
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  };

  const filteredData = useMemo(() => {
    let months = selectedMonths;
    
    // Filter months by search keyword
    if (searchKeyword) {
      months = months.filter(month => 
        month.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        lawFirms.some(firm => 
          firm.toLowerCase().includes(searchKeyword.toLowerCase())
        ) ||
        selectedServices.some(service => 
          service.toLowerCase().includes(searchKeyword.toLowerCase())
        )
      );
    }

    // Create datasets for each service type and law firm combination
    const datasets = selectedServices.flatMap((service, serviceIndex) => {
      const firms = selectedLawFirm === 'all' ? lawFirms : [selectedLawFirm];
      
      return firms.map((firm, firmIndex) => ({
        label: `${firm} - ${service}`,
        data: months.map(month => monthlyData[month][firm][service]),
        backgroundColor: [
          '#7E57C2',
          '#4CAF50',
          '#81C784',
          '#FFB74D'
        ][serviceIndex],
        borderRadius: 6,
        stack: firm // Stack bars by law firm
      }));
    });

    return {
      labels: months,
      datasets
    };
  }, [selectedMonths, selectedServices, selectedLawFirm, searchKeyword]);

  const getTotalsByLawFirm = () => {
    const totals: Record<string, number> = {};
    const firms = selectedLawFirm === 'all' ? lawFirms : [selectedLawFirm];

    firms.forEach(firm => {
      totals[firm] = selectedMonths.reduce((sum, month) => {
        return sum + selectedServices.reduce((serviceSum, service) => {
          return serviceSum + monthlyData[month][firm][service];
        }, 0);
      }, 0);
    });

    return totals;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Month Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Month Range
          </label>
          <select 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
            onChange={(e) => {
              const value = e.target.value;
              const months = Object.keys(monthlyData);
              setSelectedMonths(
                value === 'all' 
                  ? months
                  : months.slice(months.length - parseInt(value))
              );
            }}
          >
            <option value="all">All Months</option>
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
          </select>
        </div>

        {/* Service Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Type
          </label>
          <select 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedServices(
                value === 'all' 
                  ? serviceTypes
                  : [value]
              );
            }}
          >
            <option value="all">All Services</option>
            {serviceTypes.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        {/* Law Firm Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Law Firm
          </label>
          <select 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
            value={selectedLawFirm}
            onChange={(e) => setSelectedLawFirm(e.target.value)}
          >
            <option value="all">All Law Firms</option>
            {lawFirms.map(firm => (
              <option key={firm} value={firm}>{firm}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by month, firm, or service..."
              className="w-full p-2 pl-8 border rounded-lg focus:ring-2 focus:ring-[#57CC99] focus:border-transparent"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Search size={16} className="absolute left-2 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px]">
        <Bar options={options} data={filteredData} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {Object.entries(getTotalsByLawFirm()).map(([firm, total]) => (
          <div key={firm} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600">{firm} Total</h4>
            <p className="text-lg font-semibold text-gray-900">
              ${total.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensesChart;