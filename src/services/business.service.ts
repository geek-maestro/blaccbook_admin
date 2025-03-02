import { getByFilters, IFilters, post, update, getById } from "@/lib/firestoreCrud";
import { IBusiness } from "@/Types/business";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const addBusiness = async ({
  name,
  email,
  featuredImage,
  categories,
  images,
  website,
  contact,
  features,
  description,
  isEcommerce,
  isBookable,
  hasMenu,
  //   bookableDetails,
  address,
  rating,
}: IBusiness) => {
  return post("business", {
    name,
    email,
    categories,
    images,
    website,
    contact,
    features,
    isEcommerce,
    isBookable,
    hasMenu,
    address,
    // bookableDetails,
    description,
    rating,
    featuredImage,
  });
};

const editBusiness = async ({
  id,
  name,
  email,
  featuredImage,
  categories,
  images,
  website,
  contact,
  features,
  description,
  isEcommerce,
  isBookable,
  hasMenu,
  address,
  rating,
  products,
  createdAt,
  isBanned,
}: Partial<IBusiness> & { id: string }) => {
  return update("business", id, {
    name,
    email,
    categories,
    images,
    website,
    contact,
    features,
    isEcommerce,
    isBookable,
    hasMenu,
    address,
    description,
    rating,
    featuredImage,
    products,
    createdAt,
    isBanned
  });
};

export const useAddBizz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (business: IBusiness) => addBusiness(business),

    onSuccess: () => {
      console.log("Business added successfully!");
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },

    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while adding the business. Please try again.";
      console.error("Error adding business:", errorMessage);
      throw new Error(errorMessage);
    },
  });
};

export const useEditBizz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (business: Partial<IBusiness> & { id: string }) =>
      editBusiness(business),

    onSuccess: (_, variables) => {
      console.log("Business updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["business", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },

    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the business. Please try again.";
      console.error("Error updating business:", errorMessage);
      throw new Error(errorMessage);
    },
  });
};

const getBusiness = async () => {
  const filter: IFilters[] = [
    { key: "isBookable", operator: "!=", value: "true" },
  ];
  return await getByFilters("business", filter)
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error fetching businesses:", error);
      throw new Error("An error occurred while fetching businesses.");
    });
};

const getBusinessById = async (id: string) => {
  return await getById("business", id)
    .then((res: { data: IBusiness | null; error: string }) => {
      if (res.error) {
        throw new Error(res.error);
      }
      return res.data;
    })
    .catch((error: unknown) => {
      console.error("Error fetching business by id:", error);
      throw new Error("An error occurred while fetching business.");
    });
};

export const useBusinessById = (id: string) => {
  return useQuery({
    queryKey: ["business", id],
    queryFn: () => getBusinessById(id),
  });
};

export const useBusinesses = () => {
  return useQuery({
    queryKey: ["business"],
    queryFn: getBusiness,
  });
};
