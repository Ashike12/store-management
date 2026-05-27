import { CustomButton } from '@components/button/CustomButton';
import CustomTable from '@components/table/CustomTable';
import { IProduct } from '@core/interfaces/api/IProduct';
import { useCreateProductMutation, useDeleteProductMutation, useGetProductQuery, useUpdateProductMutation } from '@core/store/api/product';
import { SelectChangeEvent } from '@mui/material';
import { useMemo, useState } from 'react';
import ProductModal, { IProductForm } from '../components/productModal';
import DeleteConfirmationModal from '@components/confirmation-modal/delete-confirmation.modal';
import ProductionModal from '../components/productionModal';

// Define table columns
const columns = [
  { key: "ProductName", label: "Name" },
  { key: "Category", label: "Category" },
  { key: "SubCategory", label: "Sub Category" },
  { key: "MakingPrice", label: "MAKING_COST" },
  { key: "WholeSalerPrice", label: "Wholesaler Price" },
  { key: "EndUserDiscountedPrice", label: "End User Discounted Price" },
  { key: "Quantity", label: "QUANTITY" },
];

const initialFormData: IProductForm = {
  ItemId: "",
  ProductName: "",
  Category: "MosquitoNet",
  SubCategory: "Double",
  Description: "",
  ImageLinks: "",
  VideoLink: "",
  MakingPrice: "",
  WholeSalerPrice: "",
  EndUserPrice: "",
  EndUserDiscountedPrice: "",
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
  const parseImageLinks = (input: string): string[] =>
    input
      .split(/\r?\n|,/)
      .map((x) => x.trim())
      .filter(Boolean);
  const handleSave = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    const fieldName = String(name);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
      ...(fieldName === "Category" ? { SubCategory: "" } : {}),
    }));
  };
  const handleSubmit = async () => {
    if (isUpdate) {
      await updateProduct({
        payload: {
          ItemId: formData.ItemId,
          ProductName: formData.ProductName,
          Category: formData.Category,
          SubCategory: formData.SubCategory,
          Description: formData.Description,
          ImageLinks: parseImageLinks(formData.ImageLinks),
          VideoLink: formData.VideoLink,
          MakingPrice: Number(formData.MakingPrice),
          WholeSalerPrice: Number(formData.WholeSalerPrice),
          EndUserPrice: Number(formData.EndUserPrice),
          EndUserDiscountedPrice: Number(formData.EndUserDiscountedPrice),
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
          Category: formData.Category,
          SubCategory: formData.SubCategory,
          Description: formData.Description,
          ImageLinks: parseImageLinks(formData.ImageLinks),
          VideoLink: formData.VideoLink,
          MakingPrice: Number(formData.MakingPrice),
          WholeSalerPrice: Number(formData.WholeSalerPrice),
          EndUserPrice: Number(formData.EndUserPrice),
          EndUserDiscountedPrice: Number(formData.EndUserDiscountedPrice),
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
      Category: row.Category,
      SubCategory: row.SubCategory,
      Description: row.Description,
      ImageLinks: row.ImageLinks?.join('\n') ?? '',
      VideoLink: row.VideoLink,
      MakingPrice: row.MakingPrice.toString(),
      WholeSalerPrice: row.WholeSalerPrice.toString(),
      EndUserPrice: row.EndUserPrice.toString(),
      EndUserDiscountedPrice: row.EndUserDiscountedPrice.toString(),
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
        item.WholeSalerPrice >= priceRange[0] && item.WholeSalerPrice <= priceRange[1];

      return matchesSearch && inPriceRange;
    });
  }, [data, searchText, priceRange]);

  return (
    <>
      <div className='w-full'>
        {data && data && data?.Data?.length > 0 && (<div className="p-10 w-full">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2 items-center w-full">
              <input
                type="text"
                placeholder="Search by name or description"
                className="border p-2 rounded w-full sm:w-1/2"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <CustomButton
                onClick={() => resetForm()}
                className='cursor-pointer'
                text={'ADD_PRODUCT'}
                variant={'primary'}
              />
              <CustomButton
                onClick={() => setIsProductionOpen(true)}
                className='cursor-pointer'
                text={'ADD_PRODUCTION'}
                variant={'primary'}
              />
            </div>

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
