"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/admin/orders');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.ok ? await res.json() : [];
        setOrders(data);
      } catch (err) {
        console.error('Error fetching admin orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-6">Recent Orders</h1>
        
        <div className="bg-zinc-900/50 rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                   <TableCell colSpan={5} className="text-center py-8">Scanning logs...</TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={5} className="text-center py-8">No orders detected in sector.</TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-mono text-xs">{order.user_id}</TableCell>
                    <TableCell>
                      {order.order_items?.length} items
                      <span className="text-xs text-muted-foreground block truncate max-w-[200px]">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {order.order_items?.map((i: any) => i.products?.name).join(', ')}
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'paid' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
