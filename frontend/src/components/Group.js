import React, { useEffect, useState } from 'react';
import Cookies from "universal-cookie";
import { useLocation } from 'react-router-dom';

const cookies = new Cookies();

const Group = () => {
  const location = useLocation();
  const group = location.state?.group; // Access the passed group data
  const groupID = group._id;
  const [createdby, setCreatedby] = useState('');
  const [spent, setSpent] = useState(0);
  const [members, setMembers] = useState('');
  const [groupName, setGroupName] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [due, setTotalDue] = useState({ owedToMe: {}, iOwe: {} }); // Dues
  const [user, setUser] = useState(null); // Initialize with null for clarity

  useEffect(() => {
    const token = cookies.get("TOKEN");
    const baseURL = process.env.REACT_APP_BASE_URL;

    fetch(`${baseURL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send JWT token in Authorization header
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user); // Set user data if available
          console.log("Fetched User Data:", data.user); // Log the user data
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  useEffect(() => {
    const token = cookies.get("TOKEN");
    const baseURL = process.env.REACT_APP_BASE_URL;

    // Fetch group data
    const fetchGroupData = async () => {
      try {
        const response = await fetch(`${baseURL}/group/${groupID}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token in Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch group data');
        }

        const data = await response.json();
        if (data.group) {
          const membersList = data.group.members || [];
          const created = data.group.createdby.email || 'N/A'; // Default to 'N/A' if no email
          const emails = membersList.map(member => member.email).join(', ');
          setGroupName(data.group.name);
          setMembers(emails);
          setCreatedby(created);
          setTransactions(data.group.transactions || []);
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
  }, [groupID]);

  useEffect(() => {
    const fetchTotalSpend = async () => {
      try {
        const totalSpend = transactions.reduce((total, transaction) => {
          if (transaction.spender.email === user?.email) {
            return total + transaction.amount;
          }
          return total;
        }, 0);
        setSpent(totalSpend);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
  
    if (user) {
      fetchTotalSpend();
    }
  }, [transactions, user]); // Ensure useEffect syntax and dependencies  

  // Calculate dues based on transactions
  useEffect(() => {
    if (!user) return;

    const calculateDues = () => {
      const myEmail = user.email;
      const dues = {
        owedToMe: {},  // Who owes me and how much
        iOwe: {}       // Who I owe and how much
      };

      transactions.forEach((transaction) => {
        const spenderEmail = transaction.spender.email;
        
        transaction.splits.forEach((split) => {
          const paidForEmail = split.paid_for.email;
          const splitAmount = split.amount;

          if (spenderEmail === myEmail && paidForEmail !== myEmail) {
            // If I paid for someone else
            dues.owedToMe[paidForEmail] = (dues.owedToMe[paidForEmail] || 0) + splitAmount;
          } else if (paidForEmail === myEmail && spenderEmail !== myEmail) {
            // If someone else paid for me
            dues.iOwe[spenderEmail] = (dues.iOwe[spenderEmail] || 0) + splitAmount;
          }
        });
      });

      setTotalDue(dues);
    };

    calculateDues();
  }, [transactions, user]);

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 pt-8">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl w-full overflow-auto">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Group Details</h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p> // Loading message
        ) : error ? (
          <p className="text-center text-red-600">{error}</p> // Error message
        ) : groupID ? (
          <div>
            <p className="text-lg font-medium text-gray-800 mb-4">
              <span className="font-semibold">Group Name:</span> {groupName}
            </p>
            <p className="text-lg font-medium text-gray-800 mb-4">
              <span className="font-semibold">Created By:</span> {createdby}
            </p>
            <p className="text-lg font-medium text-gray-800 mb-4">
              <span className="font-semibold">Members:</span> {members || 'No members found.'}
            </p>
            <p className="text-lg font-medium text-gray-800">
              <span className="font-semibold">Total Spent by you:</span> ₹{spent}
            </p>

            {/* Dues List */}
            <h2 className="text-xl font-bold mt-6 mb-4 text-blue-600">Dues</h2>

            {Object.keys(due.owedToMe).length > 0 && (
              <>
                <p className="font-semibold">People who owe me:</p>
                <ul className="ml-4 list-disc">
                  {Object.entries(due.owedToMe).map(([email, amount]) => (
                    <li key={email}>{email}: ₹{amount}</li>
                  ))}
                </ul>
              </>
            )}

            {Object.keys(due.iOwe).length > 0 && (
              <>
                <p className="font-semibold mt-4">People I owe:</p>
                <ul className="ml-4 list-disc">
                  {Object.entries(due.iOwe).map(([email, amount]) => (
                    <li key={email}>{email}: ₹{amount}</li>
                  ))}
                </ul>
              </>
            )}

            {/* Transactions List */}
            <h2 className="text-xl font-bold mt-6 mb-4 text-blue-600">Transactions</h2>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction._id} className="mb-4 p-4 border rounded-lg bg-gray-50">
                  <p className="font-semibold">Description: {transaction.description}</p>
                  <p>Amount: ₹{transaction.amount}</p>
                  <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
                  <p>Spender: {transaction.spender.fullName || transaction.spender.email}</p>
                  <p>Splits:</p>
                  <ul className="ml-4 list-disc">
                    {transaction.splits.map((split) => (
                      <li key={split._id}>
                        {split.paid_for.fullName || split.paid_for.email}: ₹{split.amount}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No transactions found.</p>
            )}
          </div>
        ) : (
          <p className="text-center text-red-600">No group data available.</p>
        )}
      </div>
    </div>
  );
};

export default Group;
