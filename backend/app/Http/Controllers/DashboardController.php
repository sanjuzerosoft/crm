<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeadData;
use App\Models\Customer;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function dashboardReport()
    {
        // 1. Total Counts
        $totalLeads = LeadData::count();
        $totalCustomers = Customer::count();

        // 2. Lead Status Count
        $leadActive = LeadData::where('lead_status', 'active')->count();
        $leadInactive = LeadData::where('lead_status', 'inactive')->count();

        // 3. Customer Status Count
        $customerActive = Customer::where('customer_status', 'active')->count();
        $customerInactive = Customer::where('customer_status', 'inactive')->count();

        // 4. Last 6 Months Leads (month wise)
        $leadMonthWise = LeadData::selectRaw(
                'MONTH(created_at) as month, COUNT(*) as total'
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // 5. Last 6 Months Customers (month wise)
        $customerMonthWise = Customer::selectRaw(
                'MONTH(created_at) as month, COUNT(*) as total'
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'total_leads' => $totalLeads,
            'total_customers' => $totalCustomers,

            'lead_status' => [
                'active' => $leadActive,
                'inactive' => $leadInactive,
            ],

            'customer_status' => [
                'active' => $customerActive,
                'inactive' => $customerInactive,
            ],

            'leads_last_6_months' => $leadMonthWise,
            'customers_last_6_months' => $customerMonthWise,
        ]);
    }
}
