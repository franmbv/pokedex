"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';


interface Sprites {
  front_default: string;
}

interface Ability {
  ability: {
    name: string;
  };
}

interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: Sprites;
  abilities: Ability[];
}

const Home = () => {
  const [data, setData] = useState<PokemonData[]>([]); // Estado para almacenar los datos de la API
  const [page, setPage] = useState<number>(1); // Estado para la página actual
  const [totalPages, setTotalPages] = useState<number>(0); // Estado para el total de páginas
  const [loading, setLoading] = useState<boolean>(false); // Estado para saber si estamos cargando datos
  const limit = 25; // Límite de Pokémon por página

  // Llamada a la API con useEffect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/pokemon?page=${page}&limit=${limit}`); 
        const result = await response.json(); 
        
        if (result.data && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          setData([]); 
        }

        setTotalPages(result.totalPages || 1); // Guardar el total de páginas o establecer 1 si no se define
      } catch (error) {
        console.error('Error fetching data:', error); 
        setData([]); 
      } finally {
        setLoading(false); 
      }
    };

    fetchData(); 
  }, [page]); 

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (!loading) { 
      if (direction === 'next' && page < totalPages) {
        setPage(page + 1); 
      } else if (direction === 'prev' && page > 1) {
        setPage(page - 1); 
      }
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <p>Cargando...</p> 
          ) : data.length > 0 ? ( 
            data.map((pokemon, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4 text-center">
                <h2 className="text-xl font-bold mb-2 capitalize">
                <Image 
                  src={pokemon.sprites.front_default}
                  alt="pokemon"
                  width={100} 
                  height={100}
                  className='mx-auto mb-2'
                />
                  {/* Calcular la numeración global */}
                  {(page - 1) * limit + index + 1}. {pokemon.name}
                </h2>
                <p className="text-gray-700">Altura: {pokemon.height}</p>
                <p>Peso: {pokemon.weight}</p>
                <h3 className="text-lg font-semibold mt-4">Habilidades:</h3>
                <ul className="list-disc list-inside">
                  {pokemon.abilities?.map((ability, i) => (
                    <li key={i}>{ability.ability.name}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No se encontraron datos</p> 
          )}
        </div>

        {/* Controles de paginación */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange('prev')}
            disabled={page === 1 || loading} // Deshabilitar el botón si estamos en la primera página o cargando
            className={`px-4 py-2 rounded mr-2 ${loading ? 'bg-gray-400' : 'bg-gray-300'}`}
          >
            Anterior
          </button>
          <button
            onClick={() => handlePageChange('next')}
            disabled={page === totalPages || loading} // Deshabilitar el botón si estamos en la última página o cargando
            className={`px-4 py-2 rounded ${loading ? 'bg-gray-400' : 'bg-gray-300'}`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
