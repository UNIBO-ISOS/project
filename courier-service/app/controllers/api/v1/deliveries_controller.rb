class Api::V1::DeliveriesController < ApplicationController
    before_action :find_delivery, only: [:show, :update, :destroy]

    def index
        @deliveries = Delivery.where(courier_id: params[:courier_id])
        render json: @deliveries
    end

    def show
        render json: @delivery
    end

    def create
        @delivery = Delivery.new(delivery_params)
        if @delivery.save
            render json: @delivery , status: 201
        else
            render json: { error: 'Unable to create delivery.' }, status: 400
        end
    end

    def update
        if @delivery
            if @delivery[:courier_id] == params[:courier_id].to_i
                @delivery.update(delivery_params)
                render json: { message: 'Delivery successfully updated.' }, status: 200
            else
                render json: { error: "Unable to update another courier's delivery" }
            end
        else
            render json: { error: 'Unable to update delivery' }, status: 400
        end
    end

    def destroy
        if @delivery
            @deliveries.destroy
            render json: { message: 'Delivery successfully deleted.' }, status: 200
        else
            render json: { error: 'Unable to delete delivery' }, status: 400
        end
    end
    
    def reject
        @delivery = Delivery.find(params[:delivery_id])
        if @delivery
            @delivery.update_attribute(:status, "rejected")
            render json: { message: "Delivery successfully rejected." }, status: 200
        else
            render json: { error: "Unable to reject the delivery. It does not exist" }, status: 400
        end       
    end

    def accept
        @delivery = Delivery.find(params[:delivery_id])
        if @delivery and @delivery[:status] != "rejected"
            @price_proposal = calculate_distance(5,5,7,7) * 1.1

            @delivery.update_attribute(:status, "accepted")
            @delivery.update_attribute(:price, @price_proposal)
            render json: { message: "Delivery successfully accepted." }, status: 200
        else
            render json: { error: "Unable to accept the delivery. It does not exist" }, status: 400
        end       
    end

    def accepted
        #render json: { blbl: params[:order_id] }
        @deliveries = Delivery.where(order_id: params[:order_id], status: "accepted")
        render json: @deliveries
        #   vedere come creare dei DTO per restituire i corrieri ed i prezzi
    end

    def selectCourier
        #todo
    end

    def isSelected
        #todo
    end

    #region private
    private 

    def delivery_params
        params.require(:delivery).permit(:courier_id, :order_id, :restaurant_lat, :restaurant_lng, :destination_lat, :destination_lng, :status)
    end

    def find_delivery
        @delivery = Delivery.find(params[:id])
    end

    def calculate_distance(x0, y0, x1, y1)
        @distance = Math.sqrt((x1 - x0)**2 + (y1 - y0)**2)
        @distance
    end


    #endregion

end 