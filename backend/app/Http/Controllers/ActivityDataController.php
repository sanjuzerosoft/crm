<?php

namespace App\Http\Controllers;

use App\Models\Activitydata;

use Illuminate\Http\Request;

class ActivityDataController extends Controller
{

    // public function index()
    // {
    //     $activities = Activitydata::with(['lead', 'customer', 'project'])
    //         ->orderBy('activity_date', 'desc')
    //         ->get();

    //     return response()->json($activities, 200);
    // }
    public function index(Request $request)
{
    $query = Activitydata::with(['lead', 'customer', 'project']);

    if ($request->has('search') && $request->search != '') {
        $search = $request->search;

        $query->where(function ($q) use ($search) {

            // 🔹 search in activities table
            $q->where('type', 'like', "%$search%")
              ->orWhere('status', 'like', "%$search%")

              // 🔹 search in project name
              ->orWhereHas('project', function ($p) use ($search) {
                  $p->where('name', 'like', "%$search%");
              });
        });
    }

    $activities = $query
        ->orderBy('activity_date', 'desc')
        ->get();

    return response()->json($activities, 200);
}
    public function store(Request $request)
    {
        $request->validate([
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'required|date_format:H:i',
            'lead_id' => 'nullable|exists:lead_datas,id',
            'customer_id' => 'nullable|exists:customers,id',
            'project_id' => 'nullable|exists:projects,id',
            'description' => 'nullable|string',
            
            
        ]);

        $activity = Activitydata::create($request->all());

        return response()->json([
            'message' => 'Activity created successfully',
            'data' => $activity
        ], 201);
    }

    public function show($id)
    {
        $activity = ActivityData::with(['lead', 'customer', 'project'])
            ->find($id);

        if (!$activity) {
            return response()->json([
                'status' => false,
                'message' => 'Activity not found'
            ], 404);
        }

        return response()->json(
        //     [
        //     'status' => true,
        //     'data' => $activity
        // ],
         $activity, 200);
    }

    

    public function update(Request $request, $id)
    {
        $activity = ActivityData::find($id);

        if (!$activity) {
            return response()->json([
                'status' => false,
                'message' => 'Activity not found'
            ], 404);
        }

        $request->validate([
            'activity_date' => 'required|date',
            'type' => 'required|in:call,mail,meeting,demo',
            'status' => 'required|in:scheduled,completed,cancelled',
            'lead_id' => 'nullable|exists:lead_datas,id',
            'customer_id' => 'nullable|exists:customers,id',
            'project_id' => 'nullable|exists:projects,id',
            'description' => 'nullable|string',
        ]);

        $activity->update($request->all());

        return response()->json([
            'message' => 'Activity updated successfully',
            'data' => $activity
        ], 200);
    }

    public function destroy($id)
    {
        $activity = ActivityData::find($id);

        if (!$activity) {
            return response()->json([
                'status' => false,
                'message' => 'Activity not found'
            ], 404);
        }

        $activity->delete();

        return response()->json([
            'message' => 'Activity deleted successfully'
        ], 200);
    }
}
