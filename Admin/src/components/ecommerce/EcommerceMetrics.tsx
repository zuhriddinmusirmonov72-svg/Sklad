import { BoxIconLine } from "../../icons";
import { useOrders } from "../../pages/Orders/OrdersContext";

export default function EcommerceMetrics() {
  const { orders } = useOrders();

  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status === "Bekor qilindi") return sum;
    const orderTotal = order.lines.reduce((s, l) => s + (l.qty * l.price * (1 - l.discount / 100)), 0);
    return sum + orderTotal;
  }, 0);

  const totalLoss = orders.reduce((sum, order) => {
    if (order.status === "Bekor qilindi") return sum;
    const orderLoss = order.lines.reduce((s, l) => s + (l.qty * l.price * (l.discount / 100)), 0);
    return sum + orderLoss;
  }, 0);

  const today = new Date().toISOString().split('T')[0];
  const todayRevenue = orders.reduce((sum, order) => {
    if (order.status === "Bekor qilindi") return sum;
    if (!order.date.startsWith(today)) return sum;
    const orderTotal = order.lines.reduce((s, l) => s + (l.qty * l.price * (1 - l.discount / 100)), 0);
    return sum + orderTotal;
  }, 0);

  const totalOrders = orders.length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl dark:bg-green-500/10">
          <svg className="text-green-600 size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Jami Daromad
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {Math.round(totalRevenue).toLocaleString()} UZS
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-xl dark:bg-red-500/10">
          <svg className="text-red-600 size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Jami Ziyon (Chegirmalar)
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {Math.round(totalLoss).toLocaleString()} UZS
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl dark:bg-blue-500/10">
          <svg className="text-blue-600 size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Bugungi Daromad
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {Math.round(todayRevenue).toLocaleString()} UZS
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Jami Buyurtmalar
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalOrders}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
