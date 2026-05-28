import { CustomButton } from '@components/button/CustomButton';
import CustomTable from '@components/table/CustomTable';
import { IProduct } from '@core/interfaces/api/IProduct';
import { useCreateProductMutation, useDeleteProductMutation, useGetProductQuery, useUpdateProductMutation } from '@core/store/api/product';
import { SelectChangeEvent } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useMemo, useState } from 'react';
import ProductModal, { IProductForm } from '../components/productModal';
import DeleteConfirmationModal from '@components/confirmation-modal/delete-confirmation.modal';
import ProductionModal from '../components/productionModal';
import { PRODUCT_CATEGORY_SUBCATEGORY_MAP } from '@core/config/product-category.constants';

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
const ALL_OPTION = 'ALL';

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
  const [selectedCategory, setSelectedCategory] = useState('MosquitoNet');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Double');
  const [payload, setPayload] = useState({
    pageNumber: 1,
    pageSize: 1000,
    itemId: '',
    category: 'MosquitoNet',
    subCategory: 'Double',
    minMakingPrice: 0,
    maxMakingPrice: 100000,
  });
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
  const categoryOptions = [ALL_OPTION, ...Object.keys(PRODUCT_CATEGORY_SUBCATEGORY_MAP)];
  const subCategoryOptions = useMemo(() => {
    if (selectedCategory === ALL_OPTION) {
      return [ALL_OPTION];
    }

    const currentSubCategory = PRODUCT_CATEGORY_SUBCATEGORY_MAP[selectedCategory] ?? [];
    return [ALL_OPTION, ...currentSubCategory];
  }, [selectedCategory]);

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextCategory = e.target.value;
    const fallbackSubCategory =
      nextCategory === ALL_OPTION ? ALL_OPTION : (PRODUCT_CATEGORY_SUBCATEGORY_MAP[nextCategory]?.[0] ?? ALL_OPTION);
    setSelectedCategory(nextCategory);
    setSelectedSubCategory(fallbackSubCategory);
    setPayload((prev) => ({
      ...prev,
      category: nextCategory === ALL_OPTION ? '' : nextCategory,
      subCategory: fallbackSubCategory === ALL_OPTION ? '' : fallbackSubCategory,
    }));
  };

  const handleSubCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextSubCategory = e.target.value;
    setSelectedSubCategory(nextSubCategory);
    setPayload((prev) => ({
      ...prev,
      subCategory: nextSubCategory === ALL_OPTION ? '' : nextSubCategory,
    }));
  };

  const handleMinPriceChange = (value: string) => {
    const nextMin = Number(value) || 0;
    setPriceRange([nextMin, priceRange[1]]);
    setPayload((prev) => ({
      ...prev,
      minMakingPrice: nextMin,
    }));
  };

  const handleMaxPriceChange = (value: string) => {
    const nextMax = Number(value) || 0;
    setPriceRange([priceRange[0], nextMax]);
    setPayload((prev) => ({
      ...prev,
      maxMakingPrice: nextMax,
    }));
  };

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

  // Searched data (price range is filtered by backend using MakingPrice)
  const filteredData = useMemo(() => {
    if (!data?.Data) return [];

    return data.Data.filter(item => {
      const matchesSearch = item.ProductName.toLowerCase().includes(searchText.toLowerCase())
        || item.Description.toLowerCase().includes(searchText.toLowerCase());
      return matchesSearch;
    });
  }, [data, searchText]);

  return (
    <>
      <div className='w-full'>
        {data && data && (<div className="p-10 w-full">
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <div className="flex gap-2 items-center w-full flex-wrap">
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
                className="border p-2 mt-5 rounded w-1/2"
                placeholder="Min Price"
                value={priceRange[0]}
                onChange={(e) => handleMinPriceChange(e.target.value)}
              />
              <input
                type="number"
                className="border p-2 mt-5 rounded w-1/2"
                placeholder="Max Price"
                value={priceRange[1]}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="min-w-[190px]">
                <p className="text-xs text-text-secondary mb-1">Category</p>
                <div className="relative">
                  <select
                    className="h-10 w-full appearance-none rounded-lg border border-components-input-outlined bg-background-default px-3 pr-9 text-sm text-text-primary shadow-sm transition-all duration-200 hover:border-interaction-main focus:border-interaction-main focus:outline-none focus:ring-2 focus:ring-transparent-interaction-24"
                    value={selectedCategory}
                    onChange={handleCategoryFilterChange}
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <KeyboardArrowDownRoundedIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary" fontSize="small" />
                </div>
              </div>
              <div className="min-w-[190px]">
                <p className="text-xs text-text-secondary mb-1">Sub Category</p>
                <div className="relative">
                  <select
                    className="h-10 w-full appearance-none rounded-lg border border-components-input-outlined bg-background-default px-3 pr-9 text-sm text-text-primary shadow-sm transition-all duration-200 hover:border-interaction-main focus:border-interaction-main focus:outline-none focus:ring-2 focus:ring-transparent-interaction-24"
                    value={selectedSubCategory}
                    onChange={handleSubCategoryFilterChange}
                  >
                    {subCategoryOptions.map((subCategory) => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>
                  <KeyboardArrowDownRoundedIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary" fontSize="small" />
                </div>
              </div>
            </div>
          </div>
          {data?.Data?.length > 0 ? (
            <CustomTable
              showActionButtons={true}
              handleRowClick={handleRowClick}
              columns={columns}
              data={filteredData || []}
              rowsPerPage={10}
            />
          ) : (
            <div>No data found</div>
          )}
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
