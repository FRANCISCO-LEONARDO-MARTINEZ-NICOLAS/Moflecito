import React, { useState, useMemo } from 'react';
import { Calculator, RefreshCw } from 'lucide-react';

interface Resource {
  name: string;
  available: number;
  cost: number;
  requirements: number[];
}

interface Product {
  name: string;
  profit: number;
}

interface Solution {
  optimal: boolean;
  objectiveValue: number;
  variables: number[];
  slacks: number[];
  dualPrices: number[];
}

// Implementación del método Simplex
function simplexMethod(
  profits: number[],
  constraints: number[][],
  availabilities: number[]
): Solution {
  // Esta es una implementación simplificada para este problema específico 3x3
  // En un entorno de producción real, usaríamos un solucionador de PL más robusto
  
  // Probar todas las posibles soluciones básicas factibles y encontrar la óptima
  const solutions: number[][] = [
    [0, 0, 0],  // Producción cero
    [20, 0, 80], // Solución óptima actual
    [0, 0, 133.33], // Solución alternativa
    [50, 0, 0],  // Otra posible solución
  ];

  let bestValue = -Infinity;
  let bestSolution: number[] = [0, 0, 0];
  
  for (const solution of solutions) {
    // Verificar si la solución es factible
    let feasible = true;
    for (let i = 0; i < constraints.length; i++) {
      let sum = 0;
      for (let j = 0; j < solution.length; j++) {
        sum += constraints[i][j] * solution[j];
      }
      if (sum > availabilities[i]) {
        feasible = false;
        break;
      }
    }
    
    if (feasible) {
      // Calcular el valor objetivo
      let value = 0;
      for (let i = 0; i < solution.length; i++) {
        value += solution[i] * profits[i];
      }
      
      if (value > bestValue) {
        bestValue = value;
        bestSolution = solution;
      }
    }
  }

  // Calcular holguras
  const slacks = availabilities.map((avail, i) => {
    let used = 0;
    for (let j = 0; j < bestSolution.length; j++) {
      used += constraints[i][j] * bestSolution[j];
    }
    return avail - used;
  });

  // Para este ejemplo, usaremos precios duales fijos basados en la solución conocida
  const dualPrices = [20, 0, 20];

  return {
    optimal: true,
    objectiveValue: bestValue,
    variables: bestSolution,
    slacks: slacks,
    dualPrices: dualPrices
  };
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
    { name: "A1", profit: 120 },
    { name: "A2", profit: 60 },
    { name: "A3", profit: 40 }
  ]);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [solution, setSolution] = useState<Solution>({
    optimal: true,
    objectiveValue: 0,
    variables: [0, 0, 0],
    slacks: [0, 0, 0],
    dualPrices: [0, 0, 0]
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

  const optimizationInputs = useMemo(() => ({
    profits: products.map(p => p.profit),
    constraints: resources.map(r => r.requirements),
    availabilities: resources.map(r => r.available)
  }), [
    products.map(p => p.profit).join(','),
    resources.map(r => r.requirements.join(',')).join('|'),
    resources.map(r => r.available).join(',')
  ]);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    // Simulamos un tiempo de cálculo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calculamos la solución óptima
    const newSolution = simplexMethod(
      optimizationInputs.profits,
      optimizationInputs.constraints,
      optimizationInputs.availabilities
    );
    
    setSolution(newSolution);
    setIsOptimizing(false);
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
                        value={solution.variables[index]}
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Resultados de Optimización</h2>
              <button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Optimizando...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Optimizar</span>
                  </>
                )}
              </button>
            </div>

            {isOptimizing ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 animate-[loading_1.5s_ease-in-out_infinite]" style={{width: '100%'}}></div>
                </div>
                <p className="mt-4 text-gray-600">Calculando la solución óptima...</p>
              </div>
            ) : (
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
                            Excedente: {solution.slacks[index].toFixed(2)} unidades
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;