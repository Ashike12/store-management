import { CustomButton } from '@components/button/CustomButton';
import CustomTable from '@components/table/CustomTable';
import { IProduct } from '@core/interfaces/api/IProduct';
import { useCreateProductMutation, useDeleteProductMutation, useGetProductQuery, useUpdateProductMutation } from '@core/store/api/product';
import { useEffect, useMemo, useState } from 'react';
import ProductModal, { IProductForm } from '../components/productModal';
import DeleteConfirmationModal from '@components/confirmation-modal/delete-confirmation.modal';
import ProductionModal from '../components/productionModal';

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
  const [payload, setPayload] = useState({ pageNumber: 1, pageSize: 1000, itemId: '' });
  const { data, isLoading, refetch } = useGetProductQuery(payload);
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProductionOpen, setIsProductionOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState<IProductForm>(initialFormData);
  const [searchText, setSearchText] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
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
      await createProduct({
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

  const handleCancel = () => {
    setIsOpen(false);
    setIsUpdate(false);
    setFormData(initialFormData);
  }

  const handleRowClick = async (row: IProduct, isDelete: boolean) => {
    setFormData({
      ItemId: row.ItemId,
      ProductName: row.ProductName,
      Description: row.Description,
      MakingPrice: row.MakingPrice.toString(),
      SellingPrice: row.SellingPrice.toString(),
      Quantity: row.Quantity.toString(),
    });
    if (isDelete) {
      setIsDelete(true);
      // await deleteProduct({id: row.ItemId}).unwrap();
      // refetch();
    } else {
      setIsUpdate(true);
      setIsOpen(true);
    }
  }

  const handleDelete = async (isConfirm: boolean) => {
    setIsDelete(false);
    if (isConfirm) {
      await deleteProduct({ id: formData.ItemId }).unwrap();
      refetch();
    }
  }

  const resetForm = () => {
    setFormData(initialFormData);
    setIsOpen(true);
  }

  // Filtered and searched data
  const filteredData = useMemo(() => {
    if (!data?.Data) return [];

    return data.Data.filter(item => {
      const matchesSearch = item.ProductName.toLowerCase().includes(searchText.toLowerCase())
        || item.Description.toLowerCase().includes(searchText.toLowerCase());

      const inPriceRange =
        item.SellingPrice >= priceRange[0] && item.SellingPrice <= priceRange[1];

      return matchesSearch && inPriceRange;
    });
  }, [data, searchText, priceRange]);

  return (
    <>
      <div className='w-full'>
        <CustomButton onClick={() => resetForm()} className='fixed bottom-4 right-4 ml-4 my-3 cursor-pointer' text={'ADD_PRODUCT'} variant={'primary'}></CustomButton>
        <CustomButton onClick={() => setIsProductionOpen(true)} className='fixed bottom-4 right-36 ml-4 my-3 cursor-pointer' text={'ADD_PRODUCTION'} variant={'primary'}></CustomButton>
        {data && data && data?.Data?.length > 0 && (<div className="p-10 w-full">
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name or description"
              className="border p-2 rounded w-full sm:w-1/2"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <div className="flex gap-2 items-center w-full sm:w-1/2">
              <input
                type="number"
                className="border p-2 rounded w-1/2"
                placeholder="Min Price"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              />
              <input
                type="number"
                className="border p-2 rounded w-1/2"
                placeholder="Max Price"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              />
            </div>
          </div>
          <CustomTable
            showActionButtons={true}
            handleRowClick={handleRowClick}
            columns={columns}
            data={filteredData || []}
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
        <ProductModal isUpdate={isUpdate} handleSubmit={handleSubmit} formData={formData} isOpen={isOpen} handleFormData={handleSave} handleCancel={handleCancel} />
      )}
      {isProductionOpen && (
        <ProductionModal isOpen={isProductionOpen} handleClose={() => { setIsProductionOpen(false); refetch() }} />
      )}

      {isDelete && (
        <DeleteConfirmationModal handleConfirm={handleDelete} isOpen={true} />
      )}
    </>
  );
}
