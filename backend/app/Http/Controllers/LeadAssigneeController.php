<?php

namespace App\Http\Controllers;
use App\Models\leadassignee;

use Illuminate\Http\Request;

class LeadAssigneeController extends Controller
{
     public function index()
    {
        return leadassignee::where('status', 1)->get();
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'code' => 'required|unique:leadassignees,code',
            'email' => 'required|email|unique:leadassignees,email',
            'mobile_number' => 'required',
            'role' => 'required'
        ]);

        $assignee = leadassignee::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Lead assignee created successfully',
            'data' => $assignee
        ]);
    }

    // Update assignee
    public function update(Request $request, $id)
    {
        $assignee = leadassignee::findOrFail($id);

        $request->validate([
            'email' => 'unique:leadassignees,email,' . $id,
            'code'  => 'unique:leadassignees,code,' . $id
        ]);

        $assignee->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Lead assignee updated successfully'
        ]);
    }

    // Soft delete
    public function destroy($id)
    {
        $assignee = leadassignee::findOrFail($id);
        $assignee->update(['status' => 0]);

        return response()->json([
            'status' => true,
            'message' => 'Lead assignee removed'
        ]);
    }
}
