import { useMemo, useState } from "react";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
import FiltersButton from "@/components/generic/FiltersButton";
import CustomSelect from "@/components/generic/CustomSelect";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
// import { FiChevronDown } from "react-icons/fi";
import { FaCirclePlus } from "react-icons/fa6";
import { createCategoryColumns } from "./columns";
import AddCategoryModal from "./AddCategoryModal";
import { showToast } from "@/lib/utils/toast";
import EditCategoryModal from "./EditCategoryModal";
import type { CategoryRow, UpdateCategoryPayload } from "../types";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useToggleCategoryStatus,
  useExportCategories,
} from "../queries";
import ConfirmModal from "@/components/generic/ConfirmModal";
import { usePageSize } from "@/lib/hooks/usePageSize";

const tabs = ["All", "Active", "Hidden"];

export default function CategoriesPage() {
  const PAGE_SIZE = usePageSize();

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(
    null,
  );

  const categoriesQuery = useCategories();
  const { data: categories = [] } = categoriesQuery;

  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } =
    useUpdateCategory();
  const [deletingCategory, setDeletingCategory] = useState<CategoryRow | null>(
    null,
  );

  const { mutateAsync: removeCategory, isPending: isDeleting } =
    useDeleteCategory();
  const { mutateAsync: toggleStatus } = useToggleCategoryStatus();
  const { mutateAsync: exportCategories } = useExportCategories();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val === "All Statuses" ? "" : val);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };
  const columns = useMemo(
    () =>
      createCategoryColumns({
        onEdit: (category) => setEditingCategory(category),
        onToggleVisibility: (category) => {
          const goingHidden = category.status === "active";
          showToast.promise(toggleStatus(category.id), {
            loading: `${goingHidden ? "Hiding" : "Showing"} ${category.title}...`,
            success: `${category.title} is now ${goingHidden ? "hidden" : "active"}.`,
            error: "Couldn't update category.",
          });
        },
        onRemove: (category) => setDeletingCategory(category),
      }),
    [toggleStatus],
  );

  const handleEditCategory = (payload: UpdateCategoryPayload) => {
    if (!editingCategory) return;

    showToast.promise(
      updateCategory({ categoryId: editingCategory.id, payload }).then(() =>
        setEditingCategory(null),
      ),
      {
        loading: `Updating ${editingCategory.title}...`,
        success: "Category updated.",
        error: "Couldn't update category.",
      },
    );
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesTab =
        activeTab === "All" || category.status === activeTab.toLowerCase();

      const matchesSearch = category.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        !statusFilter || category.status === statusFilter.toLowerCase();

      let matchesDate = true;
      if (dateRange.from || dateRange.to) {
        const created = new Date(category.createdAt).getTime();
        if (Number.isNaN(created)) matchesDate = false;
        else {
          if (
            dateRange.from &&
            created < new Date(dateRange.from).setHours(0, 0, 0, 0)
          )
            matchesDate = false;
          if (
            dateRange.to &&
            created > new Date(dateRange.to).setHours(23, 59, 59, 999)
          )
            matchesDate = false;
        }
      }

      return matchesTab && matchesSearch && matchesStatus && matchesDate;
    });
  }, [categories, activeTab, search, statusFilter, dateRange]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / PAGE_SIZE),
  );

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCategories.slice(start, start + PAGE_SIZE);
  }, [filteredCategories, currentPage]);

  const handleAddCategory = (data: { title: string }) => {
    showToast.promise(
      createCategory(data).then(() => setAddModalOpen(false)),
      {
        loading: `Adding ${data.title}...`,
        success: `${data.title} has been added.`,
        error: "Couldn't add category.",
      },
    );
  };

  const handleExport = () => {
    showToast.promise(exportCategories(), {
      loading: "Preparing export...",
      success: "Export downloaded.",
      error: "Export failed.",
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingCategory) return;

    showToast.promise(
      removeCategory(deletingCategory.id).then(() => setDeletingCategory(null)),
      {
        loading: `Removing ${deletingCategory.title}...`,
        success: `${deletingCategory.title} has been removed.`,
        error: "Couldn't remove category.",
      },
    );
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Organize the taxonomy buyers use to browse the marketplace."
        actions={
          <>
            <Button
              leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
              // rightIcon={
              //   <FiChevronDown className="w-4 h-4 text-brand-gray-dark" />
              // }
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              leftIcon={<FaCirclePlus className="w-4 h-4 text-white" />}
              bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
              textColor="text-white"
              borderColor="border-transparent"
              onClick={() => setAddModalOpen(true)}
            >
              Add Category
            </Button>
          </>
        }
      />
      <TabFilter tabs={tabs} active={activeTab} onChange={handleTabChange} />

      <div>
        <TableToolbar
          label="Categories"
          count={filteredCategories.length}
          searchValue={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search categories..."
          filterSlot={
            <>
              <DateRangeFilter
                value={dateRange}
                onChange={handleDateRangeChange}
              />
              <FiltersButton activeCount={statusFilter ? 1 : 0}>
                <CustomSelect
                  label="Status"
                  value={statusFilter || "All Statuses"}
                  options={["All Statuses", "Active", "Hidden"]}
                  onChange={handleStatusFilterChange}
                />
              </FiltersButton>
            </>
          }
        />

        <DataTable
          data={paginatedCategories}
          columns={columns}
          query={categoriesQuery}
          emptyMessage="No categories found."
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {addModalOpen && (
        <AddCategoryModal
          isSubmitting={isCreating}
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAddCategory}
        />
      )}

      {editingCategory && (
        <EditCategoryModal
          title={editingCategory.title}
          isSubmitting={isUpdating}
          onClose={() => setEditingCategory(null)}
          onSubmit={handleEditCategory}
        />
      )}

      {deletingCategory && (
        <ConfirmModal
          title="Remove category"
          message={
            deletingCategory.listingCount > 0
              ? `${deletingCategory.title} has ${deletingCategory.listingCount} listing${
                  deletingCategory.listingCount === 1 ? "" : "s"
                } attached. Removing it can't be undone.`
              : `Remove ${deletingCategory.title}? This can't be undone.`
          }
          confirmLabel="Remove"
          isSubmitting={isDeleting}
          onClose={() => setDeletingCategory(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
