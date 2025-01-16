import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

interface Resource {
  name: string;
  available: number;
  cost: number;
  requirements: number[];
}

interface Product {
  name: string;
  profit: number;
  production: number;
}

interface Solution {
  optimal: boolean;
  objectiveValue: number;
  variables: number[];
  slacks: number[];
  dualPrices: number[];
}

function App() {
  const [resources, setResources] = useState<Resource[]>([
    {
      name: "Materia prima",
      available: 200,
      cost: 20,
      requirements: [4, 2, 1.5]
    },
    {
      name: "Horas-hombre",
      available: 480,
      cost: 100,
      requirements: [8, 6, 1]
    },
    {
      name: "Horas-máquina",
      available: 80,
      cost: 18,
      requirements: [2, 1.5, 0.5]
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    { name: "A1", profit: 120, production: 20 },
    { name: "A2", profit: 60, production: 0 },
    { name: "A3", profit: 40, production: 80 }
  ]);

  const [solution] = useState<Solution>({
    optimal: true,
    objectiveValue: 5600,
    variables: [20, 0, 80],
    slacks: [0, 240, 0],
    dualPrices: [20, 0, 20]
  });

  const handleResourceChange = (index: number, field: keyof Resource, value: number | number[]) => {
    const newResources = [...resources];
    newResources[index] = { ...newResources[index], [field]: value };
    setResources(newResources);
  };

  const handleProductChange = (index: number, field: keyof Product, value: number) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Calculadora de Optimización - El Moflecito
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recursos */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recursos Disponibles</h2>
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <div key={resource.name} className="space-y-2">
                  <h3 className="font-medium">{resource.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Disponibilidad</label>
                      <input
                        type="number"
                        value={resource.available}
                        onChange={(e) => handleResourceChange(index, 'available', Number(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Costo por unidad</label>
                      <input
                        type="number"
                        value={resource.cost}
                        onChange={(e) => handleResourceChange(index, 'cost', Number(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Productos */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Productos</h2>
            <div className="space-y-4">
              {products.map((product, index) => (
                <div key={product.name} className="space-y-2">
                  <h3 className="font-medium">{product.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Beneficio por unidad</label>
                      <input
                        type="number"
                        value={product.profit}
                        onChange={(e) => handleProductChange(index, 'profit', Number(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Producción óptima</label>
                      <input
                        type="number"
                        value={product.production}
                        readOnly
                        className="w-full mt-1 px-3 py-2 border rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resultados */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Resultados de Optimización</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-3">Solución Óptima</h3>
                <p className="text-lg font-bold text-blue-600">
                  Beneficio Total: ${solution.objectiveValue.toLocaleString()}
                </p>
                <div className="mt-4 space-y-2">
                  {products.map((product, index) => (
                    <p key={product.name}>
                      {product.name}: {solution.variables[index]} unidades
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Análisis de Sensibilidad</h3>
                <div className="space-y-2">
                  {resources.map((resource, index) => (
                    <p key={resource.name}>
                      {resource.name}:{' '}
                      {solution.slacks[index] === 0 ? (
                        <span className="text-yellow-600">Recurso limitante</span>
                      ) : (
                        <span className="text-green-600">
                          Excedente: {solution.slacks[index]} unidades
                        </span>
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;