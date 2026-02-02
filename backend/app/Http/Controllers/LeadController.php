<?php

namespace App\Http\Controllers;

use App\Models\LeadData;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    // GET all leads
    // public function index()
    // {
    //     return LeadData::all();
    // }
    public function index(Request $request)
{
    $query = LeadData::with(['assignee', 'industry']);

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


    // CREATE lead
    public function store(Request $request)
    {
        return LeadData::create($request->only([
                'first_name',
                'last_name',
                'lead_assignee',
                'lead_status',
                'mobile',
                'email',
                'company_name',
                'industry_type',
                'lead_source',
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

    // VIEW single lead
    public function show($id)
    {
        return LeadData::with(['assignee', 'industry'])->find($id);
        
    }

    // UPDATE lead
    public function update(Request $request, $id)
    {
        $lead = LeadData::findOrFail($id);
        $lead->update($request->only([
                'first_name',
                'last_name',
                'lead_assignee',
                'lead_status',
                'mobile',
                'email',
                'company_name',
                'industry_type',
                'lead_source',
                'website',
                'street',
                'city',
                'state',
                'country',
                'zip_code',
                'description',
            ])
            );
        return $lead;
    }

    // DELETE lead
    public function destroy($id)
    {
        LeadData::findOrFail($id)->delete();
        return ['message' => 'Lead deleted'];
    }
}
