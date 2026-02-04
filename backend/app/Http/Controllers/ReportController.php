<?php

namespace App\Http\Controllers;

use App\Models\Activitydata;

use Illuminate\Http\Request;

class ReportController extends Controller
{
 public function activityReport(Request $request)
{
    $query = Activitydata::with(['lead','customer','project']);

    if ($request->filled('type')) {
        $query->where('type', $request->type);
    }

    if ($request->filled('active_status')) {
        $query->where('status', $request->active_status);
    }
    if($request->filled('project_id')){
        $query->where('project_id', $request->project_id);
    }
    
    if ($request->filled('from_date')) {
        $query->whereDate('activity_date', '>=', $request->from_date);
    }

    if ($request->filled('to_date')) {
        $query->whereDate('activity_date', '<=', $request->to_date);
    }

    // if ($request->filled('from_date') && $request->filled('to_date')) {
    //     $query->whereBetween('activity_date', [
    //         $request->from_date,
    //         $request->to_date
    //     ]);
    // }

    return response()->json([
        'request_data' => $request->all(),
        'total' => $query->count(),
        'data' => $query->get()
    ]);
}




}
