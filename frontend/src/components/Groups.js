import React, { useEffect, useState } from 'react';
import Cookies from "universal-cookie";
import { useLocation } from 'react-router-dom';

const cookies = new Cookies();
const Groups = () => {
    const [createdby, setCreatedby] = useState('');
    const [members, setMembers] = useState('');
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
  
    useEffect(() => {
      const token = cookies.get("TOKEN");
      const baseURL = process.env.REACT_APP_BASE_URL;
  
      // Fetch group data
      const fetchGroupData = async () => {
        try {
          const response = await fetch(`${baseURL}/groups`, {
            headers: {
              Authorization: `Bearer ${token}`, // Send JWT token in Authorization header
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch group data');
          }
  
          const data = await response.json();
  
          if (data.group) {
            console.log(data.group);
            const membersList = data.group.members || [];
            const created = data.group.createdby.email || 'N/A'; // Default to 'N/A' if no email
            const emails = membersList.map(member => member.email).join(', ');
            setGroupName(data.group.name);
            setMembers(emails);
            setCreatedby(created);
          } else {
            setError('Group data is not available.');
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };
  
      fetchGroupData();
    }, []);
      
    return (
    <div class="max-w-2xl mx-auto">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div class="p-4">
                <label for="table-search" class="sr-only">Search</label>
                <div class="relative mt-1">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <input type="text" id="table-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items"/>
            </div>
                </div>
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Product name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Color
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" class="px-6 py-3">
                                <span class="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                Apple MacBook Pro 17"
                            </th>
                            <td class="px-6 py-4">
                                Sliver
                            </td>
                            <td class="px-6 py-4">
                                Laptop
                            </td>
                            <td class="px-6 py-4">
                                $2999
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            
            <script src="https://unpkg.com/flowbite@1.3.4/dist/flowbite.js"></script>
        </div>
    );
}

export default Groups;