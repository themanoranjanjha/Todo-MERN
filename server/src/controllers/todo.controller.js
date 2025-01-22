import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Todo } from "../models/todo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";




export const createTodo = asyncHandler(async (req, res ) => {
    

    try {
        const { title, description} = req.body;
        console.log(req.body);
        const user = req.user;
        console.log(user);
        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }
        if ([title, description].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "Please provide all required fields");
        }
        const todo = await Todo.create({
            title: title.trim(),
            description: description.trim(),
            user: user._id,
        });
        const createdTodo = await Todo.findById(todo._id);
        if (!createdTodo) {
            throw new ApiError(500, "Something went wrong while creating todo");
        }
        return res.status(201).json(
           new ApiResponse(200, createdTodo, "Todo created successfully")
        );
        
    } catch (error) {
       throw new ApiError(500, "Something went wrong while creating todo");
    }

});
export const getTodos = asyncHandler(async (req, res) => {
   
    try {
        const user = req.user;
        console.log(user);
        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }

        const todos = await Todo.find({ user: user._id });

        return res.status(200).json(
           new ApiResponse(200, todos, "Todos fetched successfully")
        );
    } catch (error) {
       throw new ApiError(500, "Something went wrong while fetching todos");
    }
});
export const getTodo = asyncHandler(async (req, res) => {
    
   try {
        const user = req.user;
        const { id } = req.params;

        // console.log("Step 2: User:", user);
        // console.log("Step 3: Todo ID:", id);

        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }

        const todo = await Todo.findOne({ _id: id, user: user._id });

        if (!todo) {
            throw new ApiError(404, "Todo not found");
        }

        return res.status(200).json(
            new ApiResponse(200, todo, "Todo fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching todo");
    }
});
export const updateTodo = asyncHandler(async (req, res) => {

    try {
        const user = req.user;
        const { id } = req.params;

        if (!user) {
           
            throw new ApiError(401, "Unauthorized request");
        }

        const todo = await Todo.findOne({ _id: id, user: user._id });

        if (!todo) {
            throw new ApiError(404, "Todo not found");
        }

        const { title, description, completed } = req.body;

        if ([title, description].some((field) => field?.trim() === "")) {

            throw new ApiError(400, "Please provide all required fields");
        }

        todo.title = title;
        todo.description = description;
        todo.completed = completed ?? todo.completed;

        await todo.save();


        return res.status(200).json(
            new ApiResponse(200, todo, "Todo updated successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating todo");
    }
});

export const deleteTodo = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        if (!user) {
           
            throw new ApiError(401, "Unauthorized request");
        }
        
        const todo = await Todo.findOne({ _id: id, user: user._id });

        if (!todo) {
            throw new ApiError(404, "Todo not found");
        }
        await todo.remove();
        return res.status(200).json(
           new ApiResponse(200, "Todo deleted successfully")
        );
    } catch (error) {
       throw new ApiError(500, "Something went wrong while deleting todo");
    }
});
export const todoCoplete = asyncHandler(async (req, res) => {
    try {
        const { user } = req.user;
        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            throw new ApiError(404, "Todo not found");
        }
        todo.completed = !todo.completed;
        await todo.save();
        return res.status(200).json(
           new ApiResponse(200, todo, "Todo updated successfully")
        );
    } catch (error) {
       throw new ApiError(500, "Something went wrong while complete todo");
    }
});
