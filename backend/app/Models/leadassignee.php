<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class leadassignee extends Model
{
    use HasFactory;
    protected $table = 'leadassignees';
    protected $fillable = [
        'name',
        'code',
        'email',
        'mobile_number',
        'role',
        'status'
    ];
}
