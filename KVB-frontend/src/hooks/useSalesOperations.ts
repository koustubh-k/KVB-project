import { useState, useEffect, useCallback } from "react";
import { salesApi } from "@/lib/api.sales";
import { Lead, Quotation, Product } from "@/types/sales";

export const useSalesOperations = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [leadsRes, quotationsRes, productsRes] = await Promise.all([
        salesApi.getLeads(),
        salesApi.getQuotations(),
        salesApi.getProducts(),
      ]);

      setLeads(leadsRes.data);
      setQuotations(quotationsRes.data);
      setProducts(productsRes.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch sales data. Please try again.");
      console.error("Error fetching sales data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateLeadStatus = async (
    id: string,
    status: string,
    notes: string
  ) => {
    try {
      await salesApi.updateLead(id, { status, notes });
      await fetchData();
    } catch (err) {
      setError("Failed to update lead status. Please try again.");
      console.error("Error updating lead status:", err);
    }
  };

  const createQuotation = async (data: {
    productId: string;
    customerId: string;
    price: number;
    terms: string;
    validUntil: string;
  }) => {
    try {
      await salesApi.createQuotation(data);
      await fetchData();
    } catch (err) {
      setError("Failed to create quotation. Please try again.");
      console.error("Error creating quotation:", err);
    }
  };

  const convertLeadToQuotation = async (
    leadId: string,
    data: {
      productId: string;
      price: number;
      terms: string;
      validUntil: string;
    }
  ) => {
    try {
      await salesApi.convertLeadToQuotation(leadId, data);
      await fetchData();
    } catch (err) {
      setError("Failed to convert lead to quotation. Please try again.");
      console.error("Error converting lead:", err);
    }
  };

  return {
    leads,
    quotations,
    products,
    loading,
    error,
    updateLeadStatus,
    createQuotation,
    convertLeadToQuotation,
    refresh: fetchData,
  };
};
