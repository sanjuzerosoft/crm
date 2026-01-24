<?php

namespace App\Http\Controllers;
use App\Models\Customer;

use Illuminate\Http\Request;

class CustomerController extends Controller
{
    // public function index()
    // {
    //     return Customer::all();
    // }
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('mobile', 'like', "%$search%");
            });
        }

        return $query->latest()->get();
    }
    // CREATE customer
    public function store(Request $request)
    {
        return Customer::create(
            $request->only([
                'first_name',
                'last_name',
                'customer_assignee',
                'customer_status',
                'mobile',
                'email',
                'company_name',
                'industry_type',
                'customer_source',
                'website',
                'street',
                'city',
                'state',
                'country',
                'zip_code',
                'description',
            ])
        );
    }

    // VIEW single customer
    public function show($id)
    {
        return Customer::findOrFail($id);
    }

    // UPDATE customer
    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);
        $customer->update(
            $request->only([
                'first_name',
                'last_name',
                'customer_assignee',
                'customer_status',
                'mobile',
                'email',
                'company_name',
                'industry_type',
                'customer_source',
                'website',
                'street',
                'city',
                'state',
                'country',
                'zip_code',
                'description',
            ])
        );
        return $customer;
    }

    // DELETE customer
    public function destroy($id)
    {
        Customer::findOrFail($id)->delete();
        return ['message' => 'customer deleted'];
    }
}
