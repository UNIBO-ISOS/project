class Api::V1::CouriersController < ApplicationController
    
    # GET /couriers
    def index
        @couriers = Courier.all
        render json: @couriers
    end

    # GET /couriers/:id
    def show
        @courier = Courier.find(params[:id])
        render json: @courier
    end

    # POST /couriers/:id/availability
    def availability
        @price_proposal = rand(10...42) 

        #render json: { }, stauts: 200

        @proposal_with_bk = {
            messageName: "Message_rcvPrice",
            businessKey: "default",
            localCorrelationKeys: {
                InputCourier: {
                    value: params[:id],
                    type: "String"
                }
            },
            processVariables: {
                price: {
                    value: @price_proposal,
                    type: "Double"
                }
            }
        }

        render status: 200

        #puts @proposal_with_bk
        send_data_to_unlock_token(@proposal_with_bk)
    end

    def confirm
        render status: 200
    end

    private 

    def client_ip
        request.ip
    end

    def send_data_to_unlock_token(message)
        puts message
        #render json: @message, status: 200

        Spawnling.new do
            uri = URI.parse("http://" + client_ip + '/')
            
            http = Net::HTTP.new(uri.host, uri.port)
            request = Net::HTTP::Post.new(uri.request_uri)
            request.body = message.to_json
    
            response = http.request(request)
        end
    end
end
