import { CustomButton } from '@components/button/CustomButton';
import CustomTable from '@components/table/CustomTable';
import { useState } from 'react';
import DeleteConfirmationModal from '@components/confirmation-modal/delete-confirmation.modal';
import UserModal, { IUserForm } from '../components/userModal';
import { useCreateUserMutation, useDeleteUserMutation, useGetUserQuery, useUpdateUserMutation } from '@core/store/api';
import { IUser } from '@core/interfaces/api/IUser';
import { useNavigate } from 'react-router-dom';

// Define table columns
const columns = [
  { key: "DisplayName", label: "NAME" },
  { key: "Email", label: "EMAIL" },
  { key: "Address", label: "ADDRESS" },
  { key: "Phone", label: "PHONE_NUMBER" },
];

const initialFormData: IUserForm = {
  ItemId: "",
  FirstName: "",
  LastName: "",
  Email: "",
  Address: "",
  Phone: "",
  Password: "",
  Active: false,
}

export default function StoreManagement() {
  const { data, isLoading, refetch } = useGetUserQuery({ pageNumber: 1, pageSize: 10, itemId: '' });
  const [createProduct, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState<IUserForm>(initialFormData);
  const navigate = useNavigate();
  const handleSave = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async () => {
    if (isUpdate) {
      await updateProduct({
        payload: {
          ItemId: formData.ItemId,
          FirstName: formData.FirstName,
          DisplayName: formData.FirstName + ' ' + formData.LastName,
          LastName: formData.LastName,
          Email: formData.Email,
          Address: formData.Address,
          Phone: formData.Phone,
          Active: formData.Active
        }
      }).unwrap();
      setIsOpen(false);
      setIsUpdate(false);
      refetch();
    } else {
      await createProduct({
        payload: {
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          Email: formData.Email,
          Address: formData.Address,
          Phone: formData.Phone,
          Password: formData.Password
        }
      }).unwrap();
      setIsOpen(false);
      refetch();
    }
  }

  const handleRowClick = async (row: IUser, isDelete: boolean, isGoDetails?: boolean) => {
    console.log('row', row);
    setFormData({
      ItemId: row.ItemId,
      FirstName: row.FirstName,
      LastName: row.LastName,
      Email: row.Email,
      Address: row.Address,
      Phone: row.Phone,
      Password: row.Password ?? '',
      Active: row.Active
    });
    if (isDelete) {
      setIsDelete(true);
      // await deleteProduct({id: row.ItemId}).unwrap();
      // refetch();
    }
    else if(isGoDetails) {
      navigate(`/wholesaler/invoice/${row.ItemId}?phoneNumber=${row.Phone}&wholesalerName=${row.FirstName + ' ' + row.LastName}`);
    } else {
      setIsUpdate(true);
      setIsOpen(true);
    }
  }

  const handleCancel = () => {
    setIsOpen(false);
    setIsUpdate(false);
    setFormData(initialFormData);
  }

  const handleDelete = async (isConfirm: boolean) => {
    setIsDelete(false);
    if(isConfirm){
      await deleteProduct({id: formData.ItemId}).unwrap();
      refetch();
    }
  }

  const resetForm = () => {
    setFormData(initialFormData);
    setIsOpen(true);
  }
  return (
    <>
      <div className='w-full'>
        <CustomButton onClick={() => resetForm()} className='fixed bottom-4 right-4 ml-4 my-3 cursor-pointer' text={'ADD_USER'} variant={'primary'}></CustomButton>
        {data && data && data?.Data?.length > 0 && (<div className="p-10 w-full">
          <CustomTable
            showActionButtons={true}
            isRowClickable={true}
            handleRowClick={handleRowClick}
            columns={columns}
            data={data?.Data || []}
            rowsPerPage={10} />
        </div>)}
        {!isLoading && data && data && data?.Data?.length == 0 && (<div className="p-10 w-full">
          No data found
        </div>)}
        {(isLoading) && (<div className="p-10 w-full">
          Loading...
        </div>)}
      </div>
      {isOpen && (
        <UserModal isUpdate={isUpdate} handleSubmit={handleSubmit} formData={formData} isOpen={isOpen} handleFormData={handleSave} handleCancel={handleCancel} />
      )}

      {isDelete && (
        <DeleteConfirmationModal handleConfirm={handleDelete} isOpen={true} />
      )}
    </>
  );
}
