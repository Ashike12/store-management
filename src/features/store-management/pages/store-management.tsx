import { CustomButton } from '@components/button/CustomButton';
import CustomTable from '@components/table/CustomTable';
import { ICreateProductPayload, IProduct, IProductResponse } from '@core/interfaces/api/IProduct';
import { useCreateProductMutation, useGetProductQuery, useUpdateProductMutation } from '@core/store/api/product';
import { useState } from 'react';
import ProductModal, { IProductForm } from '../components/productModal';

// Define table columns
const columns = [
  { key: "ProductName", label: "Name" },
  { key: "MakingPrice", label: "MAKING_COST" },
  { key: "SellingPrice", label: "SELLING_COST" },
  { key: "Quantity", label: "QUANTITY" },
];

const initialFormData: IProductForm = {
  ItemId: "",
  ProductName: "",
  Description: "",
  MakingPrice: "",
  SellingPrice: "",
  Quantity: "",
}

export default function StoreManagement() {
  const { data, isLoading, refetch } = useGetProductQuery({ pageNumber: 1, pageSize: 10, itemId: '' });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState<IProductForm>(initialFormData);
  const handleSave = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = () => {
    if (isUpdate) {
      updateProduct({
        payload: {
          ItemId: formData.ItemId,
          ProductName: formData.ProductName,
          Description: formData.Description,
          MakingPrice: Number(formData.MakingPrice),
          SellingPrice: Number(formData.SellingPrice),
          Quantity: Number(formData.Quantity),
        }
      }).unwrap();
      setIsOpen(false);
      setIsUpdate(false);
      refetch();
    } else {
      createProduct({
        payload: {
          ProductName: formData.ProductName,
          Description: formData.Description,
          MakingPrice: Number(formData.MakingPrice),
          SellingPrice: Number(formData.SellingPrice),
          Quantity: Number(formData.Quantity),
        }
      }).unwrap();
      setIsOpen(false);
      refetch();
    }
  }

  const handleRowClick = (row: IProduct) => {
    setFormData({
      ItemId: row.ItemId,
      ProductName: row.ProductName,
      Description: row.Description,
      MakingPrice: row.MakingPrice.toString(),
      SellingPrice: row.SellingPrice.toString(),
      Quantity: row.Quantity.toString(),
    });
    setIsUpdate(true);
    setIsOpen(true);
  }

  const resetForm = () => {
    setFormData(initialFormData);
    setIsOpen(true);
  }
  return (
    <>
      <div className='w-full'>
        <CustomButton onClick={() => resetForm()} className='fixed bottom-4 right-4 ml-4 my-3 cursor-pointer' text={'ADD_PRODUCT'} variant={'primary'}></CustomButton>
        {data && data && data?.Data?.length > 0 && (<div className="p-10 w-full">
          <CustomTable handleRowClick={handleRowClick} columns={columns} data={data?.Data || []} rowsPerPage={10} />
        </div>)}
        {(isLoading) && (<div className="p-10 w-full">
          Loading...
        </div>)}
      </div>
      {isOpen && (
        <ProductModal isUpdate={isUpdate} handleSubmit={handleSubmit} formData={formData} isOpen={isOpen} handleFormData={handleSave} setIsOpen={setIsOpen} />
      )}
    </>
  );
}
