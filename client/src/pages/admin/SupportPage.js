// import React from 'react';
// import { MessageBox } from '../../components';

// const SupportPage = () => {
//   return (
//     <div className="row top full-container">
//       <div className="col-1 support-users">
//         {users.filter((x) => x._id !== user._id).length === 0 && (
//           <MessageBox>No Online User found</MessageBox>
//         )}
//         <ul>
//           {users
//             .filter((x) => x._id !== user._id)
//             .map((u) => (
//               <li
//                 key={u._id}
//                 className={user._id === selectedUser._id ? 'selected' : ''}
//               >
//                 <button
//                   className="block"
//                   type="button"
//                   onClick={() => selectedUser(user)}
//                 >
//                   {u.name}
//                 </button>
//                 <span
//                   className={
//                     u.unread ? 'unread' : user.online ? 'online' : 'offline'
//                   }
//                 ></span>
//               </li>
//             ))}
//         </ul>
//       </div>
//       <div className="col-3 support-messages">
//         {!selectedUse._id ? (
//           <MessageBox>Select a user to start chat</MessageBox>
//         ) : (
//           <div>
//             <div className="row"></div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SupportPage;
