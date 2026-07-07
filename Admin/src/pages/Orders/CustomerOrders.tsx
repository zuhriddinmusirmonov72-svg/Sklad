import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import { useOrders } from "./OrdersContext";
import { OrderStatus } from "./types";

const statusColor: Record<OrderStatus, "success" | "warning" | "primary" | "error"> = {
  "Jo'natilgan": "success", "Jo'natilmagan": "warning", "Bekor qilindi": "error",
};

export default function CustomerOrders() {
  const { orders } = useOrders();

  return (
    <>
      <PageMeta title="Mijoz buyurtmalari" description="Barcha buyurtmalar tarixi" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Mijoz buyurtmalari</h2>
        </div>
        <div className="p-5">
          {orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Hozircha buyurtmalar yo'q.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Vaqt/Sana</th>
                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Mijoz</th>
                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Sklad</th>
                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Summa</th>
                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Holati</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {orders.map(o => {
                    const total = o.lines.reduce((s, l) => s + l.qty * l.price * (1 - l.discount / 100), 0);
                    const dateObj = new Date(o.date);
                    const formattedDate = `${dateObj.toLocaleDateString("uz-UZ")} ${dateObj.toLocaleTimeString("uz-UZ", { hour: '2-digit', minute: '2-digit' })}`;
                    
                    return (
                      <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-gray-500">{formattedDate}</td>
                        <td className="px-4 py-3 font-medium text-blue-600 hover:underline">
                          <Link to={`/orders/view/${o.id}`}>{o.customer}</Link>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{o.warehouse}</td>
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{Math.round(total).toLocaleString()} {o.currency}</td>
                        <td className="px-4 py-3">
                          <Badge size="sm" color={statusColor[o.status] || "primary"}>{o.status}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
